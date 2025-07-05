import { storage } from "./storage";
import { notificationService } from "./emailService";

export class BookingService {
  
  async createBooking(bookingData: any, userId: string) {
    try {
      // 1. Validate seat availability
      const seats = await Promise.all(
        bookingData.seatNumbers.map((seatNum: string) => 
          storage.getSeat(`${bookingData.busId}-seat-${seatNum}`)
        )
      );

      const unavailableSeats = seats.filter(seat => 
        !seat || seat.status !== 'available'
      );

      if (unavailableSeats.length > 0) {
        throw new Error('Some seats are no longer available');
      }

      // 2. Lock seats temporarily
      await Promise.all(
        bookingData.seatNumbers.map((seatNum: string) =>
          storage.updateSeatStatus(`${bookingData.busId}-seat-${seatNum}`, 'locked')
        )
      );

      // 3. Calculate total amount
      const bus = await storage.getBus(bookingData.busId);
      if (!bus) throw new Error('Bus not found');

      const totalAmount = seats.reduce((sum, seat) => 
        sum + parseFloat(seat?.price || bus.price), 0
      );

      // 4. Create booking record
      const booking = await storage.createBooking({
        ...bookingData,
        userId,
        totalAmount: totalAmount.toString(),
        status: 'pending',
        bookingDate: new Date().toISOString(),
      });

      // 5. Process payment (placeholder - integrate with Razorpay later)
      const paymentSuccess = await this.processPayment(booking.id, totalAmount);

      if (paymentSuccess) {
        // 6. Confirm booking and update seat status
        await storage.updateBooking(booking.id, { status: 'confirmed' });
        
        await Promise.all(
          bookingData.seatNumbers.map((seatNum: string) =>
            storage.updateSeatStatus(`${bookingData.busId}-seat-${seatNum}`, 'booked')
          )
        );

        // 7. Send confirmation notifications
        const user = await storage.getUser(userId);
        if (user?.email) {
          await notificationService.sendBookingConfirmation(
            booking, 
            bus, 
            user.email
          );
        }

        return { success: true, booking };
      } else {
        // Payment failed - release seats
        await Promise.all(
          bookingData.seatNumbers.map((seatNum: string) =>
            storage.updateSeatStatus(`${bookingData.busId}-seat-${seatNum}`, 'available')
          )
        );
        
        throw new Error('Payment processing failed');
      }

    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string, userId: string) {
    try {
      const booking = await storage.getBooking(bookingId);
      if (!booking) throw new Error('Booking not found');
      
      if (booking.userId !== userId) {
        throw new Error('Unauthorized to cancel this booking');
      }

      // Check cancellation policy (24 hours before journey)
      const journeyDate = new Date(booking.journeyDate);
      const now = new Date();
      const hoursUntilJourney = (journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilJourney < 24) {
        throw new Error('Cancellation not allowed within 24 hours of journey');
      }

      // Calculate refund amount (90% refund policy)
      const refundAmount = parseFloat(booking.totalAmount) * 0.9;

      // Update booking status
      await storage.updateBooking(bookingId, { 
        status: 'cancelled',
        refundAmount: refundAmount.toString(),
      });

      // Release seats
      await Promise.all(
        booking.seatNumbers.map((seatNum: string) =>
          storage.updateSeatStatus(`${booking.busId}-seat-${seatNum}`, 'available')
        )
      );

      // Process refund
      await this.processRefund(bookingId, refundAmount);

      // Send cancellation notification
      const user = await storage.getUser(userId);
      if (user?.email) {
        await notificationService.sendCancellationNotification(
          { ...booking, refundAmount }, 
          user.email
        );
      }

      return { success: true, refundAmount };

    } catch (error) {
      console.error('Booking cancellation error:', error);
      throw error;
    }
  }

  async processPayment(bookingId: string, amount: number): Promise<boolean> {
    try {
      // Placeholder for payment processing
      // TODO: Integrate with Razorpay when keys are available
      console.log(`💳 Processing payment for booking ${bookingId}: ₹${amount}`);
      
      // Simulate payment success (replace with actual payment gateway)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  }

  async processRefund(bookingId: string, amount: number): Promise<boolean> {
    try {
      console.log(`🔄 Processing refund for booking ${bookingId}: ₹${amount}`);
      
      // TODO: Integrate with payment gateway refund API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Refund processing error:', error);
      return false;
    }
  }

  async getBookingAnalytics() {
    try {
      const bookings = await storage.getBookings();
      
      const analytics = {
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum, booking) => 
          sum + parseFloat(booking.totalAmount || '0'), 0
        ),
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        monthlyData: this.calculateMonthlyAnalytics(bookings),
      };

      return analytics;
    } catch (error) {
      console.error('Analytics calculation error:', error);
      throw error;
    }
  }

  private calculateMonthlyAnalytics(bookings: any[]) {
    const monthlyData: { [key: string]: { revenue: number, bookings: number } } = {};
    
    bookings.forEach(booking => {
      const month = new Date(booking.bookingDate).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, bookings: 0 };
      }
      monthlyData[month].revenue += parseFloat(booking.totalAmount || '0');
      monthlyData[month].bookings += 1;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));
  }

  async scheduleReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const bookings = await storage.getBookings();
      const tomorrowBookings = bookings.filter(booking => {
        const journeyDate = new Date(booking.journeyDate);
        return journeyDate.toDateString() === tomorrow.toDateString() &&
               booking.status === 'confirmed';
      });

      for (const booking of tomorrowBookings) {
        const user = await storage.getUser(booking.userId);
        if (user?.email) {
          await notificationService.sendReminderNotification(booking, user.email);
        }
      }

      console.log(`📅 Sent ${tomorrowBookings.length} travel reminders`);
    } catch (error) {
      console.error('Reminder scheduling error:', error);
    }
  }
}

export const bookingService = new BookingService();