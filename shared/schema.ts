import { pgTable, text, serial, integer, boolean, uuid, timestamp, decimal, date, time, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = ['user', 'admin'] as const;
export const bookingStatusEnum = ['confirmed', 'cancelled', 'pending', 'completed'] as const;
export const seatStatusEnum = ['available', 'booked', 'locked'] as const;

// Routes table
export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  distance: integer("distance"),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bus operators table
export const busOperators = pgTable("bus_operators", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.0"),
  totalBuses: integer("total_buses").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Buses table
export const buses = pgTable("buses", {
  id: uuid("id").primaryKey().defaultRandom(),
  busNumber: text("bus_number").notNull().unique(),
  operatorId: uuid("operator_id").notNull().references(() => busOperators.id),
  routeId: uuid("route_id").notNull().references(() => routes.id),
  departureTime: time("departure_time").notNull(),
  arrivalTime: time("arrival_time").notNull(),
  travelDate: date("travel_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalSeats: integer("total_seats").notNull().default(40),
  availableSeats: integer("available_seats").notNull().default(40),
  busType: text("bus_type").default("AC Sleeper"),
  amenities: text("amenities").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Seats table
export const seats = pgTable("seats", {
  id: uuid("id").primaryKey().defaultRandom(),
  busId: uuid("bus_id").notNull().references(() => buses.id),
  seatNumber: text("seat_number").notNull(),
  seatType: text("seat_type").default("standard"),
  position: jsonb("position"), // {row: 1, column: 'A', level: 'lower'}
  status: text("status").notNull().default("available"), // available, booked, locked
  lockedUntil: timestamp("locked_until"),
  lockedBy: text("locked_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingNumber: text("booking_number").notNull().unique(),
  userId: text("user_id").notNull(),
  busId: uuid("bus_id").notNull().references(() => buses.id),
  seatIds: text("seat_ids").array().notNull(),
  passengerDetails: jsonb("passenger_details").notNull(), // [{name, age, gender, email, phone}]
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  paymentId: text("payment_id"),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  travelDate: date("travel_date").notNull(),
  cancellationReason: text("cancellation_reason"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").default("mock_payment"),
  transactionId: text("transaction_id"),
  status: text("status").default("completed"),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Legacy users table (keep for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schemas
export const insertRouteSchema = createInsertSchema(routes);
export const insertBusOperatorSchema = createInsertSchema(busOperators);
export const insertBusSchema = createInsertSchema(buses);
export const insertSeatSchema = createInsertSchema(seats);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type BusOperator = typeof busOperators.$inferSelect;
export type InsertBusOperator = z.infer<typeof insertBusOperatorSchema>;
export type Bus = typeof buses.$inferSelect;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type Seat = typeof seats.$inferSelect;
export type InsertSeat = z.infer<typeof insertSeatSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
