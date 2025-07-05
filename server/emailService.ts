// Email service for booking confirmations and notifications
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SMSOptions {
  to: string;
  message: string;
}

export class NotificationService {
  async sendBookingConfirmation(booking: any, busDetails: any, userEmail: string) {
    const emailContent = {
      to: userEmail,
      subject: `Booking Confirmed - ${busDetails.operatorName} Bus`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmation</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Trip Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Route:</strong> ${busDetails.fromCity} → ${busDetails.toCity}</p>
            <p><strong>Date:</strong> ${booking.journeyDate}</p>
            <p><strong>Departure:</strong> ${busDetails.departureTime}</p>
            <p><strong>Arrival:</strong> ${busDetails.arrivalTime}</p>
            <p><strong>Seat Numbers:</strong> ${booking.seatNumbers.join(', ')}</p>
            <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          </div>
          <div style="background: #e7f3ff; padding: 15px; border-radius: 8px;">
            <h4>Important Instructions:</h4>
            <ul>
              <li>Carry a valid ID proof for verification</li>
              <li>Report at boarding point 15 minutes before departure</li>
              <li>Keep this confirmation handy during travel</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            For support, contact us at support@busBooking.com
          </p>
        </div>
      `,
      text: `Booking Confirmed! Trip: ${busDetails.fromCity} to ${busDetails.toCity} on ${booking.journeyDate}. Booking ID: ${booking.id}`
    };

    return this.sendEmail(emailContent);
  }

  async sendCancellationNotification(booking: any, userEmail: string) {
    const emailContent = {
      to: userEmail,
      subject: `Booking Cancelled - Refund Initiated`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Booking Cancelled</h2>
          <p>Your booking ${booking.id} has been successfully cancelled.</p>
          <p>Refund of ₹${booking.refundAmount} will be processed within 5-7 business days.</p>
        </div>
      `,
      text: `Booking ${booking.id} cancelled. Refund of ₹${booking.refundAmount} will be processed within 5-7 business days.`
    };

    return this.sendEmail(emailContent);
  }

  async sendReminderNotification(booking: any, userEmail: string) {
    const emailContent = {
      to: userEmail,
      subject: `Travel Reminder - Journey Tomorrow`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Travel Reminder</h2>
          <p>This is a reminder for your upcoming journey tomorrow.</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p>Have a safe journey!</p>
        </div>
      `,
      text: `Travel reminder: Your journey is tomorrow. Booking ID: ${booking.id}`
    };

    return this.sendEmail(emailContent);
  }

  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Log email for development - replace with actual email service
      console.log('📧 Email sent:', {
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Integrate with SendGrid when API key is provided
      // if (process.env.SENDGRID_API_KEY) {
      //   await sendGridService.send(options);
      // }
      
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  async sendSMS(options: SMSOptions): Promise<boolean> {
    try {
      // Log SMS for development - replace with actual SMS service
      console.log('📱 SMS sent:', {
        to: options.to,
        message: options.message.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      });
      
      // TODO: Integrate with Twilio or other SMS service
      return true;
    } catch (error) {
      console.error('SMS service error:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();