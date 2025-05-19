export const sendEmailNotification = async ({ to, subject, message }: { to: string; subject: string; message: string }): Promise<void> => {
  // Placeholder for actual email sending logic
  console.log(`Sending email to ${to} with subject: ${subject} and message: ${message}`);
  // You would integrate a real email service here (e.g., SendGrid, AWS SES, etc.)
}; 