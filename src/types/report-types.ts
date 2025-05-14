// Define common interfaces for reports
export interface BaseItem {
  id: string;
  [key: string]: any;
}

// Define export format types
export type ExportFormat = 'pdf' | 'csv';

// Define report types
export type ReportType = 'gift-summary' | 'thank-you-list' | 'event-summary' | 'guest-list';

// Options for report generation
export interface ReportOptions {
  title: string;
  subtitle?: string;
  includeNotes?: boolean;
  includePrice?: boolean;
  filterByEvent?: string;
  filterByDate?: { start: string; end: string };
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  logo?: string; // URL to logo for PDF header
  footerText?: string; // Custom footer text
}

// Define interface for CSV data - any object with string keys
export interface CSVData {
  [key: string]: string | number | boolean | null | undefined;
}
