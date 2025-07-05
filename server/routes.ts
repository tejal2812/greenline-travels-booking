import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRouteSchema, insertBusOperatorSchema, insertBusSchema, insertBookingSchema } from "@shared/schema";
import { seedDatabase } from "./seedData";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Development seed route
  app.post('/api/seed', async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  // Routes API
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.get("/api/routes/search", async (req, res) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res.status(400).json({ error: "From and to cities are required" });
      }
      
      const routes = await storage.getRoutesByFromTo(from as string, to as string);
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to search routes" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const validatedRoute = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedRoute);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ error: "Invalid route data" });
    }
  });

  // Bus Operators API
  app.get("/api/bus-operators", async (req, res) => {
    try {
      const operators = await storage.getBusOperators();
      res.json(operators);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bus operators" });
    }
  });

  app.get("/api/bus-operators/:id", async (req, res) => {
    try {
      const operator = await storage.getBusOperator(req.params.id);
      if (!operator) {
        return res.status(404).json({ error: "Bus operator not found" });
      }
      res.json(operator);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bus operator" });
    }
  });

  app.post("/api/bus-operators", async (req, res) => {
    try {
      const validatedOperator = insertBusOperatorSchema.parse(req.body);
      const operator = await storage.createBusOperator(validatedOperator);
      res.status(201).json(operator);
    } catch (error) {
      res.status(400).json({ error: "Invalid bus operator data" });
    }
  });

  // Buses API
  app.get("/api/buses", async (req, res) => {
    try {
      const buses = await storage.getBuses();
      res.json(buses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buses" });
    }
  });

  app.get("/api/buses/search", async (req, res) => {
    try {
      const { from, to, date } = req.query;
      if (!from || !to || !date) {
        return res.status(400).json({ error: "From, to, and date are required" });
      }
      
      const buses = await storage.getBusesByRoute(from as string, to as string, date as string);
      res.json(buses);
    } catch (error) {
      res.status(500).json({ error: "Failed to search buses" });
    }
  });

  app.get("/api/buses/:id", async (req, res) => {
    try {
      const bus = await storage.getBus(req.params.id);
      if (!bus) {
        return res.status(404).json({ error: "Bus not found" });
      }
      res.json(bus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bus" });
    }
  });

  app.post("/api/buses", async (req, res) => {
    try {
      const validatedBus = insertBusSchema.parse(req.body);
      const bus = await storage.createBus(validatedBus);
      res.status(201).json(bus);
    } catch (error) {
      res.status(400).json({ error: "Invalid bus data" });
    }
  });

  // Seats API
  app.get("/api/buses/:busId/seats", async (req, res) => {
    try {
      const seats = await storage.getSeatsByBus(req.params.busId);
      res.json(seats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seats" });
    }
  });

  app.patch("/api/seats/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const seat = await storage.updateSeatStatus(req.params.id, status);
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      res.json(seat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update seat status" });
    }
  });

  // Bookings API
  app.get("/api/bookings", async (req, res) => {
    try {
      const { userId } = req.query;
      let bookings;
      
      if (userId) {
        bookings = await storage.getBookingsByUser(userId as string);
      } else {
        bookings = await storage.getBookings();
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedBooking = insertBookingSchema.parse(req.body);
      
      // Generate booking number if not provided
      if (!validatedBooking.bookingNumber) {
        validatedBooking.bookingNumber = `YB${Date.now()}${Math.floor(Math.random() * 1000)}`;
      }
      
      const booking = await storage.createBooking(validatedBooking);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // Payments API
  app.get("/api/bookings/:bookingId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByBooking(req.params.bookingId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time seat updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'seat_lock':
            // Lock seat for 10 minutes during booking process
            await storage.updateSeatStatus(data.seatId, 'locked');
            broadcast({
              type: 'seat_locked',
              seatId: data.seatId,
              busId: data.busId
            });
            break;
            
          case 'seat_unlock':
            await storage.updateSeatStatus(data.seatId, 'available');
            broadcast({
              type: 'seat_unlocked', 
              seatId: data.seatId,
              busId: data.busId
            });
            break;
            
          case 'join_bus':
            // Join room for specific bus updates
            ws.busId = data.busId;
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  function broadcast(message: any) {
    wss.clients.forEach((client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  return httpServer;
}
