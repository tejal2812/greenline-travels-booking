import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Seed Bus Operators
    const operators = [
      {
        id: "op-1",
        name: "RedBus Express",
        contactEmail: "contact@redbusexpress.com",
        contactPhone: "+91-9876543210",
        rating: "4.5",
        totalBuses: 25,
        description: "Premium AC buses with comfortable seating"
      },
      {
        id: "op-2", 
        name: "Travels India",
        contactEmail: "info@travelsindia.com",
        contactPhone: "+91-9876543211",
        rating: "4.2",
        totalBuses: 18,
        description: "Reliable and affordable bus services"
      },
      {
        id: "op-3",
        name: "Highway King",
        contactEmail: "booking@highwayking.com", 
        contactPhone: "+91-9876543212",
        rating: "4.7",
        totalBuses: 32,
        description: "Luxury sleeper and semi-sleeper buses"
      }
    ];

    for (const operator of operators) {
      await storage.createBusOperator(operator);
    }

    // Seed Routes
    const routes = [
      {
        id: "route-1",
        fromCity: "Delhi",
        toCity: "Jaipur", 
        distance: 280,
        duration: 300 // 5 hours
      },
      {
        id: "route-2",
        fromCity: "Mumbai",
        toCity: "Pune",
        distance: 150,
        duration: 180 // 3 hours
      },
      {
        id: "route-3", 
        fromCity: "Bangalore",
        toCity: "Chennai",
        distance: 350,
        duration: 420 // 7 hours
      },
      {
        id: "route-4",
        fromCity: "Delhi",
        toCity: "Manali",
        distance: 570,
        duration: 720 // 12 hours
      },
      {
        id: "route-5",
        fromCity: "Mumbai",
        toCity: "Goa",
        distance: 460,
        duration: 600 // 10 hours
      }
    ];

    for (const route of routes) {
      await storage.createRoute(route);
    }

    // Seed Buses
    const buses = [
      {
        id: "bus-1",
        operatorId: "op-1",
        routeId: "route-1",
        busNumber: "DL01AC1234",
        busType: "AC Sleeper",
        totalSeats: 40,
        amenities: ["AC", "WiFi", "Charging Port", "Entertainment"],
        departureTime: "22:00",
        arrivalTime: "03:00",
        price: "800",
        travelDate: "2025-01-10"
      },
      {
        id: "bus-2", 
        operatorId: "op-2",
        routeId: "route-2",
        busNumber: "MH01SC5678",
        busType: "AC Semi Sleeper",
        totalSeats: 45,
        amenities: ["AC", "Charging Port"],
        departureTime: "08:00", 
        arrivalTime: "11:00",
        price: "450",
        travelDate: "2025-01-10"
      },
      {
        id: "bus-3",
        operatorId: "op-3", 
        routeId: "route-3",
        busNumber: "KA01LX9999",
        busType: "Luxury AC",
        totalSeats: 32,
        amenities: ["AC", "WiFi", "Charging Port", "Entertainment", "Snacks"],
        departureTime: "23:30",
        arrivalTime: "06:30", 
        price: "1200",
        travelDate: "2025-01-10"
      },
      {
        id: "bus-4",
        operatorId: "op-1",
        routeId: "route-4", 
        busNumber: "DL01HP1111",
        busType: "Volvo AC",
        totalSeats: 38,
        amenities: ["AC", "WiFi", "Charging Port", "Blanket"],
        departureTime: "20:00",
        arrivalTime: "08:00",
        price: "1500",
        travelDate: "2025-01-11"
      },
      {
        id: "bus-5",
        operatorId: "op-2",
        routeId: "route-5",
        busNumber: "MH01GA2222", 
        busType: "AC Sleeper",
        totalSeats: 42,
        amenities: ["AC", "Entertainment", "Charging Port"],
        departureTime: "21:00",
        arrivalTime: "07:00",
        price: "1100",
        travelDate: "2025-01-11"
      }
    ];

    for (const bus of buses) {
      await storage.createBus(bus);
    }

    // Seed Seats for each bus
    const seatLayouts = {
      40: "2+2", // AC Sleeper
      45: "2+3", // Semi Sleeper  
      32: "2+2", // Luxury
      38: "2+2", // Volvo
      42: "2+2"  // AC Sleeper
    };

    for (const bus of buses) {
      const layout = seatLayouts[bus.totalSeats as keyof typeof seatLayouts];
      for (let i = 1; i <= bus.totalSeats; i++) {
        const seatNumber = layout === "2+2" ? 
          `${Math.ceil(i/4)}${String.fromCharCode(65 + ((i-1) % 4))}` :
          `${Math.ceil(i/5)}${String.fromCharCode(65 + ((i-1) % 5))}`;
        
        await storage.createSeat({
          id: `${bus.id}-seat-${i}`,
          busId: bus.id,
          seatNumber,
          seatType: i <= bus.totalSeats * 0.3 ? "premium" : "regular",
          status: "available",
          position: JSON.stringify({
            row: Math.ceil(i / (layout === "2+2" ? 4 : 5)),
            column: (i-1) % (layout === "2+2" ? 4 : 5)
          })
        });
      }
    }

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Created: ${operators.length} operators, ${routes.length} routes, ${buses.length} buses`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}