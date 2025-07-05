export interface Bus {
  id: string;
  operator: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  rating: number;
  amenities: string[];
  busType: string;
  image: string;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  popularTimes: string[];
  image: string;
}

export interface Booking {
  id: string;
  busId: string;
  passengerName: string;
  passengerAge: number;
  passengerEmail: string;
  seatNumbers: string[];
  bookingDate: string;
  journeyDate: string;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  ticketId: string;
}

export const mockBuses: Bus[] = [
  {
    id: "bus-1",
    operator: "GreenLine Express",
    from: "Delhi",
    to: "Jaipur",
    departureTime: "08:00",
    arrivalTime: "13:30",
    duration: "5h 30m",
    price: 850,
    seatsAvailable: 12,
    totalSeats: 40,
    rating: 4.5,
    amenities: ["WiFi", "AC", "Charging Port", "Snacks"],
    busType: "Semi-Sleeper",
    image: "/src/assets/bus-1.jpg"
  },
  {
    id: "bus-2",
    operator: "SpeedBus",
    from: "Delhi",
    to: "Jaipur",
    departureTime: "14:00",
    arrivalTime: "19:15",
    duration: "5h 15m",
    price: 750,
    seatsAvailable: 8,
    totalSeats: 35,
    rating: 4.2,
    amenities: ["AC", "Charging Port", "Water Bottle"],
    busType: "Seater",
    image: "/src/assets/bus-2.jpg"
  },
  {
    id: "bus-3",
    operator: "ComfortRide",
    from: "Mumbai",
    to: "Pune",
    departureTime: "06:30",
    arrivalTime: "09:45",
    duration: "3h 15m",
    price: 450,
    seatsAvailable: 15,
    totalSeats: 32,
    rating: 4.3,
    amenities: ["AC", "WiFi", "Movies"],
    busType: "Seater",
    image: "/src/assets/bus-1.jpg"
  },
  {
    id: "bus-4",
    operator: "LuxuryTravel",
    from: "Mumbai",
    to: "Pune",
    departureTime: "20:00",
    arrivalTime: "23:30",
    duration: "3h 30m",
    price: 650,
    seatsAvailable: 6,
    totalSeats: 28,
    rating: 4.7,
    amenities: ["WiFi", "AC", "Charging Port", "Blanket", "Pillow"],
    busType: "Sleeper",
    image: "/src/assets/bus-2.jpg"
  },
];

export const mockRoutes: Route[] = [
  {
    id: "route-1",
    from: "Delhi",
    to: "Jaipur",
    distance: "280 km",
    duration: "5-6 hours",
    popularTimes: ["Early Morning", "Afternoon"],
    image: "/src/assets/hero-image.jpg"
  },
  {
    id: "route-2",
    from: "Mumbai",
    to: "Pune",
    distance: "150 km",
    duration: "3-4 hours",
    popularTimes: ["Morning", "Evening"],
    image: "/src/assets/hero-image.jpg"
  },
  {
    id: "route-3",
    from: "Bangalore",
    to: "Chennai",
    distance: "350 km",
    duration: "6-7 hours",
    popularTimes: ["Night", "Early Morning"],
    image: "/src/assets/hero-image.jpg"
  },
  {
    id: "route-4",
    from: "Delhi",
    to: "Chandigarh",
    distance: "250 km",
    duration: "4-5 hours",
    popularTimes: ["Morning", "Afternoon"],
    image: "/src/assets/hero-image.jpg"
  },
];

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    busId: "bus-1",
    passengerName: "John Doe",
    passengerAge: 28,
    passengerEmail: "john@example.com",
    seatNumbers: ["A1", "A2"],
    bookingDate: "2024-01-15",
    journeyDate: "2024-01-20",
    totalAmount: 1700,
    status: "confirmed",
    ticketId: "TKT001234"
  },
];

export const cities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Jaipur", "Ahmedabad", "Surat", "Lucknow", "Kanpur",
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna",
  "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Chandigarh"
];