import { db } from "./db";
import { 
  users, 
  routes, 
  busOperators, 
  buses, 
  seats, 
  bookings, 
  payments,
  type User, 
  type InsertUser,
  type UpsertUser,
  type Route,
  type InsertRoute,
  type BusOperator,
  type InsertBusOperator,
  type Bus,
  type InsertBus,
  type Seat,
  type InsertSeat,
  type Booking,
  type InsertBooking,
  type Payment,
  type InsertPayment
} from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Route methods
  getRoutes(): Promise<Route[]>;
  getRoutesByFromTo(from: string, to: string): Promise<Route[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Bus operator methods
  getBusOperators(): Promise<BusOperator[]>;
  getBusOperator(id: string): Promise<BusOperator | undefined>;
  createBusOperator(operator: InsertBusOperator): Promise<BusOperator>;
  
  // Bus methods
  getBuses(): Promise<Bus[]>;
  getBusesByRoute(fromCity: string, toCity: string, travelDate: string): Promise<Bus[]>;
  getBus(id: string): Promise<Bus | undefined>;
  createBus(bus: InsertBus): Promise<Bus>;
  
  // Seat methods
  getSeatsByBus(busId: string): Promise<Seat[]>;
  getSeat(id: string): Promise<Seat | undefined>;
  updateSeatStatus(id: string, status: string): Promise<Seat | undefined>;
  createSeat(seat: InsertSeat): Promise<Seat>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined>;
  
  // Payment methods
  getPaymentsByBooking(bookingId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
}

export class DatabaseStorage implements IStorage {
  // User methods for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Route methods
  async getRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async getRoutesByFromTo(from: string, to: string): Promise<Route[]> {
    return await db.select().from(routes).where(
      and(eq(routes.fromCity, from), eq(routes.toCity, to))
    );
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const result = await db.insert(routes).values(route).returning();
    return result[0];
  }

  // Bus operator methods
  async getBusOperators(): Promise<BusOperator[]> {
    return await db.select().from(busOperators);
  }

  async getBusOperator(id: string): Promise<BusOperator | undefined> {
    const result = await db.select().from(busOperators).where(eq(busOperators.id, id));
    return result[0];
  }

  async createBusOperator(operator: InsertBusOperator): Promise<BusOperator> {
    const result = await db.insert(busOperators).values(operator).returning();
    return result[0];
  }

  // Bus methods
  async getBuses(): Promise<Bus[]> {
    return await db.select().from(buses);
  }

  async getBusesByRoute(fromCity: string, toCity: string, travelDate: string): Promise<Bus[]> {
    return await db
      .select({
        id: buses.id,
        busNumber: buses.busNumber,
        operatorId: buses.operatorId,
        routeId: buses.routeId,
        departureTime: buses.departureTime,
        arrivalTime: buses.arrivalTime,
        travelDate: buses.travelDate,
        price: buses.price,
        totalSeats: buses.totalSeats,
        availableSeats: buses.availableSeats,
        busType: buses.busType,
        amenities: buses.amenities,
        createdAt: buses.createdAt,
        updatedAt: buses.updatedAt,
      })
      .from(buses)
      .innerJoin(routes, eq(buses.routeId, routes.id))
      .where(
        and(
          eq(routes.fromCity, fromCity),
          eq(routes.toCity, toCity),
          eq(buses.travelDate, travelDate)
        )
      );
  }

  async getBus(id: string): Promise<Bus | undefined> {
    const result = await db.select().from(buses).where(eq(buses.id, id));
    return result[0];
  }

  async createBus(bus: InsertBus): Promise<Bus> {
    const result = await db.insert(buses).values(bus).returning();
    return result[0];
  }

  // Seat methods
  async getSeatsByBus(busId: string): Promise<Seat[]> {
    return await db.select().from(seats).where(eq(seats.busId, busId));
  }

  async getSeat(id: string): Promise<Seat | undefined> {
    const result = await db.select().from(seats).where(eq(seats.id, id));
    return result[0];
  }

  async updateSeatStatus(id: string, status: string): Promise<Seat | undefined> {
    const result = await db
      .update(seats)
      .set({ status, updatedAt: new Date() })
      .where(eq(seats.id, id))
      .returning();
    return result[0];
  }

  async createSeat(seat: InsertSeat): Promise<Seat> {
    const result = await db.insert(seats).values(seat).returning();
    return result[0];
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const result = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }

  // Payment methods
  async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.bookingId, bookingId));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }
}

// Keep MemStorage for backward compatibility during migration
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user = userData as User;
    this.users.set(this.currentId++, user);
    return user;
  }

  // Stub implementations for other methods (throw errors to indicate not implemented)
  async getRoutes(): Promise<Route[]> { throw new Error("Not implemented in MemStorage"); }
  async getRoutesByFromTo(): Promise<Route[]> { throw new Error("Not implemented in MemStorage"); }
  async createRoute(): Promise<Route> { throw new Error("Not implemented in MemStorage"); }
  async getBusOperators(): Promise<BusOperator[]> { throw new Error("Not implemented in MemStorage"); }
  async getBusOperator(): Promise<BusOperator | undefined> { throw new Error("Not implemented in MemStorage"); }
  async createBusOperator(): Promise<BusOperator> { throw new Error("Not implemented in MemStorage"); }
  async getBuses(): Promise<Bus[]> { throw new Error("Not implemented in MemStorage"); }
  async getBusesByRoute(): Promise<Bus[]> { throw new Error("Not implemented in MemStorage"); }
  async getBus(): Promise<Bus | undefined> { throw new Error("Not implemented in MemStorage"); }
  async createBus(): Promise<Bus> { throw new Error("Not implemented in MemStorage"); }
  async getSeatsByBus(): Promise<Seat[]> { throw new Error("Not implemented in MemStorage"); }
  async getSeat(): Promise<Seat | undefined> { throw new Error("Not implemented in MemStorage"); }
  async updateSeatStatus(): Promise<Seat | undefined> { throw new Error("Not implemented in MemStorage"); }
  async createSeat(): Promise<Seat> { throw new Error("Not implemented in MemStorage"); }
  async getBookings(): Promise<Booking[]> { throw new Error("Not implemented in MemStorage"); }
  async getBookingsByUser(): Promise<Booking[]> { throw new Error("Not implemented in MemStorage"); }
  async getBooking(): Promise<Booking | undefined> { throw new Error("Not implemented in MemStorage"); }
  async createBooking(): Promise<Booking> { throw new Error("Not implemented in MemStorage"); }
  async updateBooking(): Promise<Booking | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getPaymentsByBooking(): Promise<Payment[]> { throw new Error("Not implemented in MemStorage"); }
  async createPayment(): Promise<Payment> { throw new Error("Not implemented in MemStorage"); }
}

// Switch to DatabaseStorage
export const storage = new DatabaseStorage();
