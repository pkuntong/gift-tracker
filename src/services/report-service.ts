import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import { BaseItem, ExportFormat, ReportOptions, ReportType } from '../types/report-types';

// Define specific interfaces for our reports
interface Gift extends BaseItem {
  name: string;
  price: number;
  giver: string;
  occasion: string;
  date: string;
  thankYouSent: boolean;
  acknowledged: boolean;
  notes?: string;
}

interface Event extends BaseItem {
  name: string;
  date: string;
  type: string;
  description: string;
}

interface Guest extends BaseItem {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  rsvpStatus?: 'pending' | 'confirmed' | 'declined';
  eventId?: string;
  notes?: string;
}

/**
 * Exports gift data to CSV format
 */
export const exportToCSV = (data: any[], filename: string): void => {
  try {
    // Convert data to CSV format
    const csv = unparse(data);
    
    // Create a blob and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * Generic function to export data to PDF
 */
export const exportToPDF = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ReportOptions
): void => {
  try {
    const doc = new jsPDF();
    const { title, subtitle, footerText } = options;
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(12);
      doc.text(subtitle, 14, 30);
    }
    
    // Add date
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, subtitle ? 38 : 30);
    
    // Add table
    (doc as any).autoTable({
      startY: subtitle ? 42 : 34,
      head: [columns.map(col => col.header)],
      body: data.map(item => columns.map(col => item[col.dataKey] || '')),
      margin: { top: 10 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 0: { cellWidth: 'auto' } },
    });
    
    // Add footer if provided
    if (footerText) {
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(footerText, 14, doc.internal.pageSize.height - 10);
      }
    }
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

/**
 * Exports gift summary to PDF or CSV
 */
export const exportGiftSummary = (gifts: Gift[], format: ExportFormat, options: ReportOptions): void => {
  try {
    // Apply filters
    let filteredGifts = [...gifts];
    
    if (options.filterByEvent) {
      filteredGifts = filteredGifts.filter(gift => gift.occasion === options.filterByEvent);
    }
    
    if (options.filterByDate) {
      const startDate = new Date(options.filterByDate.start).getTime();
      const endDate = new Date(options.filterByDate.end).getTime();
      filteredGifts = filteredGifts.filter(gift => {
        const giftDate = new Date(gift.date).getTime();
        return giftDate >= startDate && giftDate <= endDate;
      });
    }
    
    // Sort the gifts
    if (options.sortBy) {
      filteredGifts.sort((a, b) => {
        const aValue = a[options.sortBy || 'date'];
        const bValue = b[options.sortBy || 'date'];
        
        if (options.sortDirection === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      });
    }
    
    // Export based on format
    if (format === 'csv') {
      // Prepare data for CSV export
      const csvData = filteredGifts.map(gift => {
        const data: Record<string, any> = {
          'Gift Name': gift.name,
          'Giver': gift.giver,
          'Occasion': gift.occasion,
          'Date': gift.date,
          'Thank You Sent': gift.thankYouSent ? 'Yes' : 'No',
        };
        
        if (options.includePrice) {
          data['Price'] = gift.price;
        }
        
        if (options.includeNotes && gift.notes) {
          data['Notes'] = gift.notes;
        }
        
        return data;
      });
      
      exportToCSV(csvData, `gift-summary-${new Date().toISOString().split('T')[0]}`);
    } else {
      // Prepare columns for PDF export
      const columns = [
        { header: 'Gift', dataKey: 'name' },
        { header: 'Giver', dataKey: 'giver' },
        { header: 'Date', dataKey: 'date' },
        { header: 'Occasion', dataKey: 'occasion' },
      ];
      
      if (options.includePrice) {
        columns.push({ header: 'Price', dataKey: 'price' });
      }
      
      if (options.includeNotes) {
        columns.push({ header: 'Notes', dataKey: 'notes' });
      }
      
      columns.push({ header: 'Thank You Sent', dataKey: 'thankYouStatus' });
      
      // Format the gift data for PDF
      const pdfData = filteredGifts.map(gift => ({
        ...gift,
        price: gift.price ? `$${gift.price.toFixed(2)}` : '',
        thankYouStatus: gift.thankYouSent ? 'Yes' : 'No',
        date: new Date(gift.date).toLocaleDateString(),
      }));
      
      exportToPDF(pdfData, columns, options);
    }
  } catch (error) {
    console.error('Error exporting gift summary:', error);
    throw error;
  }
};

/**
 * Exports thank you list to PDF or CSV
 */
export const exportThankYouList = (gifts: Gift[], format: ExportFormat, options: ReportOptions): void => {
  try {
    // Filter for gifts that need thank you notes
    const needThankYou = gifts.filter(gift => !gift.thankYouSent);
    
    // Apply additional filters
    let filteredGifts = [...needThankYou];
    
    if (options.filterByEvent) {
      filteredGifts = filteredGifts.filter(gift => gift.occasion === options.filterByEvent);
    }
    
    if (options.filterByDate) {
      const startDate = new Date(options.filterByDate.start).getTime();
      const endDate = new Date(options.filterByDate.end).getTime();
      filteredGifts = filteredGifts.filter(gift => {
        const giftDate = new Date(gift.date).getTime();
        return giftDate >= startDate && giftDate <= endDate;
      });
    }
    
    // Sort the gifts
    filteredGifts.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return aDate - bDate; // Oldest first by default
    });
    
    // Export based on format
    if (format === 'csv') {
      // Prepare data for CSV export
      const csvData = filteredGifts.map(gift => ({
        'Gift Name': gift.name,
        'Giver': gift.giver,
        'Date Received': gift.date,
        'Occasion': gift.occasion,
        'Notes': gift.notes || '',
      }));
      
      exportToCSV(csvData, `thank-you-list-${new Date().toISOString().split('T')[0]}`);
    } else {
      // Prepare columns for PDF export
      const columns = [
        { header: 'Giver', dataKey: 'giver' },
        { header: 'Gift', dataKey: 'name' },
        { header: 'Date Received', dataKey: 'date' },
        { header: 'Occasion', dataKey: 'occasion' },
      ];
      
      if (options.includeNotes) {
        columns.push({ header: 'Notes', dataKey: 'notes' });
      }
      
      // Format the gift data for PDF
      const pdfData = filteredGifts.map(gift => ({
        ...gift,
        date: new Date(gift.date).toLocaleDateString(),
      }));
      
      // Update options for thank you list
      const thankYouOptions = {
        ...options,
        title: options.title || 'Thank You Notes To Send',
        subtitle: `${filteredGifts.length} thank you notes pending`,
      };
      
      exportToPDF(pdfData, columns, thankYouOptions);
    }
  } catch (error) {
    console.error('Error exporting thank you list:', error);
    throw error;
  }
};

/**
 * Exports event summary to PDF or CSV
 */
export const exportEventSummary = (event: Event, gifts: Gift[], guests: Guest[], format: ExportFormat, options: ReportOptions): void => {
  try {
    // Filter gifts for this event
    const eventGifts = gifts.filter(gift => gift.occasion === event.name);
    
    // Filter guests for this event
    const eventGuests = guests.filter(guest => guest.eventId === event.id);
    
    if (format === 'csv') {
      // For CSV, we'll create separate sections
      const eventDetails = [{
        'Event Name': event.name,
        'Date': event.date,
        'Type': event.type,
        'Description': event.description || '',
        'Total Gifts': eventGifts.length,
        'Total Guests': eventGuests.length,
        'Confirmed Guests': eventGuests.filter(g => g.rsvpStatus === 'confirmed').length,
      }];
      
      exportToCSV(eventDetails, `event-summary-${event.name.replace(/\s+/g, '-').toLowerCase()}`);
      
      // Export gifts and guests as separate files if there are any
      if (eventGifts.length > 0) {
        exportGiftSummary(eventGifts, 'csv', {
          ...options,
          title: `Gifts for ${event.name}`,
        });
      }
      
      if (eventGuests.length > 0) {
        exportToCSV(
          eventGuests.map(guest => ({
            'Name': guest.name,
            'Email': guest.email,
            'Phone': guest.phone || '',
            'Address': guest.address || '',
            'RSVP Status': guest.rsvpStatus || 'pending',
            'Notes': guest.notes || '',
          })),
          `guest-list-${event.name.replace(/\s+/g, '-').toLowerCase()}`
        );
      }
    } else {
      // For PDF, we'll create a comprehensive report
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Event Summary: ${event.name}`, 14, 22);
      
      // Add event details
      doc.setFontSize(12);
      doc.text('Event Details', 14, 32);
      
      doc.setFontSize(10);
      doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 14, 40);
      doc.text(`Type: ${event.type}`, 14, 46);
      doc.text(`Total Gifts: ${eventGifts.length}`, 14, 52);
      doc.text(`Total Guests: ${eventGuests.length}`, 14, 58);
      doc.text(`Confirmed Guests: ${eventGuests.filter(g => g.rsvpStatus === 'confirmed').length}`, 14, 64);
      
      if (event.description) {
        doc.text('Description:', 14, 72);
        doc.text(event.description, 14, 78);
      }
      
      // Add gift summary if there are gifts
      let currentY = event.description ? 88 : 72;
      
      if (eventGifts.length > 0) {
        doc.setFontSize(12);
        doc.text('Gift Summary', 14, currentY);
        currentY += 8;
        
        (doc as any).autoTable({
          startY: currentY,
          head: [['Gift', 'Giver', 'Thank You Sent']],
          body: eventGifts.map(gift => [
            gift.name,
            gift.giver,
            gift.thankYouSent ? 'Yes' : 'No',
          ]),
          margin: { top: 10 },
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Add guest list if there are guests
      if (eventGuests.length > 0) {
        // Check if we need a new page
        if (currentY > 180) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(12);
        doc.text('Guest List', 14, currentY);
        currentY += 8;
        
        (doc as any).autoTable({
          startY: currentY,
          head: [['Name', 'Email', 'RSVP Status']],
          body: eventGuests.map(guest => [
            guest.name,
            guest.email,
            guest.rsvpStatus || 'pending',
          ]),
          margin: { top: 10 },
        });
      }
      
      // Save the PDF
      doc.save(`event-summary-${event.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    }
  } catch (error) {
    console.error('Error exporting event summary:', error);
    throw error;
  }
};

/**
 * Exports guest list to PDF or CSV
 */
export const exportGuestList = (guests: Guest[], format: ExportFormat, options: ReportOptions): void => {
  try {
    // Apply filters
    let filteredGuests = [...guests];
    
    if (options.filterByEvent) {
      filteredGuests = filteredGuests.filter(guest => guest.eventId === options.filterByEvent);
    }
    
    // Sort the guests
    if (options.sortBy) {
      filteredGuests.sort((a, b) => {
        const aValue = a[options.sortBy || 'name'];
        const bValue = b[options.sortBy || 'name'];
        
        if (options.sortDirection === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      });
    }
    
    // Export based on format
    if (format === 'csv') {
      // Prepare data for CSV export
      const csvData = filteredGuests.map(guest => {
        const data: Record<string, any> = {
          'Name': guest.name,
          'Email': guest.email,
          'RSVP Status': guest.rsvpStatus || 'pending',
        };
        
        if (guest.phone) {
          data['Phone'] = guest.phone;
        }
        
        if (guest.address) {
          data['Address'] = guest.address;
        }
        
        if (options.includeNotes && guest.notes) {
          data['Notes'] = guest.notes;
        }
        
        return data;
      });
      
      exportToCSV(csvData, `guest-list-${new Date().toISOString().split('T')[0]}`);
    } else {
      // Prepare columns for PDF export
      const columns = [
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'RSVP Status', dataKey: 'rsvpStatus' },
      ];
      
      if (filteredGuests.some(guest => guest.phone)) {
        columns.push({ header: 'Phone', dataKey: 'phone' });
      }
      
      if (filteredGuests.some(guest => guest.address)) {
        columns.push({ header: 'Address', dataKey: 'address' });
      }
      
      if (options.includeNotes) {
        columns.push({ header: 'Notes', dataKey: 'notes' });
      }
      
      // Format the guest data for PDF
      const pdfData = filteredGuests.map(guest => ({
        ...guest,
        rsvpStatus: guest.rsvpStatus ? (guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)) : 'Pending',
      }));
      
      exportToPDF(pdfData, columns, options);
    }
  } catch (error) {
    console.error('Error exporting guest list:', error);
    throw error;
  }
};

/**
 * Creates a shareable link for a report
 * In a full implementation, this would upload the report to a storage service and return a URL,
 * but for this example, we'll just generate a data URL for PDF reports.
 */
export const createShareableLink = async (
  reportType: ReportType,
  reportData: any,
  options: ReportOptions
): Promise<string> => {
  // In a real implementation, this would upload the report to Firebase Storage
  // and return a shareable link with appropriate permissions
  
  // For demonstration purposes, we'll return a placeholder URL
  console.log(`Creating shareable link for ${options.title} with ${reportData.length} items`);
  return `https://gift-tracker-app.com/shared-reports/${reportType}-${Date.now()}`;
};

/**
 * Emails a report to specified recipients
 */
export const emailReport = async (
  reportType: ReportType,
  reportData: any,
  recipients: string[],
  options: ReportOptions
): Promise<boolean> => {
  try {
    // In a real implementation, this would use an email service or API
    // to send the report as an attachment
    
    // For demonstration purposes, we'll just log the action
    console.log(`Sending ${reportType} report titled '${options.title}' with ${reportData.length} items to:`, recipients);
    
    // Simulate success
    return true;
  } catch (error) {
    console.error('Error emailing report:', error);
    return false;
  }
};
