import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Clock, MapPin, Users, Wifi, Power, Coffee } from "lucide-react";
import { mockBuses, type Bus } from "@/lib/mockData";
import busInterior from "@/assets/bus-interior.jpg";

const BusDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const foundBus = mockBuses.find(b => b.id === id);
    setBus(foundBus || null);
  }, [id]);

  if (!bus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bus not found</h2>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate seat layout (simplified)
  const generateSeatLayout = () => {
    const seats = [];
    const bookedSeats = ["A1", "B3", "C2", "D4"]; // Mock booked seats
    
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = bus.busType === "Sleeper" ? 3 : 4;
    
    for (let row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        seats.push({
          id: seatId,
          isBooked,
          isSelected,
          isAisle: i === 2 // Add aisle after 2nd seat
        });
      }
    }
    
    return seats;
  };

  const seats = generateSeatLayout();

  const handleSeatSelect = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < 4) { // Max 4 seats
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalAmount = selectedSeats.length * bus.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bus Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bus Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{bus.operator}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{bus.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img 
                      src={busInterior} 
                      alt="Bus Interior" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-lg">{bus.from} → {bus.to}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{bus.departureTime} - {bus.arrivalTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>{bus.seatsAvailable} seats available</span>
                    </div>
                    
                    <div>
                      <Badge variant="secondary" className="mb-2">{bus.busType}</Badge>
                      <div className="text-sm text-muted-foreground">
                        Duration: {bus.duration}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="font-semibold mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities.map(amenity => (
                      <Badge key={amenity} variant="outline" className="flex items-center space-x-1">
                        {amenity === "WiFi" && <Wifi className="h-3 w-3" />}
                        {amenity === "Charging Port" && <Power className="h-3 w-3" />}
                        {amenity === "Snacks" && <Coffee className="h-3 w-3" />}
                        <span>{amenity}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-secondary border rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto">
                  {/* Driver Section */}
                  <div className="text-center mb-4 p-2 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Driver</span>
                  </div>
                  
                  {/* Seats Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {seats.map((seat, index) => (
                      <div key={seat.id} className="flex">
                        <button
                          onClick={() => !seat.isBooked && handleSeatSelect(seat.id)}
                          disabled={seat.isBooked}
                          className={`
                            w-8 h-8 text-xs font-medium rounded transition-colors
                            ${seat.isBooked 
                              ? 'bg-destructive text-destructive-foreground cursor-not-allowed'
                              : seat.isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80 border'
                            }
                          `}
                        >
                          {seat.id}
                        </button>
                        {seat.isAisle && <div className="w-4"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-medium">{bus.from} → {bus.to}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">Jan 20, 2024</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{bus.departureTime}</span>
                </div>
                
                <Separator />
                
                {selectedSeats.length > 0 && (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">Selected Seats:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSeats.map(seat => (
                          <Badge key={seat} variant="secondary">{seat}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Seats ({selectedSeats.length}):</span>
                      <span className="font-medium">₹{totalAmount}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-primary">₹{totalAmount}</span>
                    </div>
                  </>
                )}
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                  disabled={selectedSeats.length === 0}
                  asChild
                >
                  <Link 
                    to="/booking" 
                    state={{ 
                      bus, 
                      selectedSeats, 
                      totalAmount,
                      journeyDate: 'Jan 20, 2024'
                    }}
                  >
                    Continue to Book
                  </Link>
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  You can select up to 4 seats
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;