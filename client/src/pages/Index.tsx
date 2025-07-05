import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowRight, Star, MapPin, Clock, Shield, Users, Wifi, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { cities, mockRoutes } from "@/lib/mockData";
import { Link, useLocation } from "wouter";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    if (from && to && date) {
      const searchParams = new URLSearchParams({ from, to, date: format(date, "yyyy-MM-dd") });
      setLocation(`/search?${searchParams.toString()}`);
    }
  };

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Excellent service! Clean buses and punctual timing. Highly recommend GreenBus for comfortable travel.",
      route: "Delhi to Jaipur"
    },
    {
      name: "Rahul Kumar",
      rating: 5,
      comment: "Great booking experience and friendly staff. The bus was comfortable with all promised amenities.",
      route: "Mumbai to Pune"
    },
    {
      name: "Anjali Patel",
      rating: 4,
      comment: "Good value for money. Safe and reliable travel option. Will definitely use again.",
      route: "Bangalore to Chennai"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-primary to-primary-light flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 text-center text-primary-foreground px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Travel Comfortably with <span className="text-accent-foreground">GreenBus</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
            Book your bus tickets online and enjoy a safe, comfortable journey
          </p>
          
          {/* Quick Search */}
          <Card className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="From City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="To City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "MMM dd") : <span>Select Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                  disabled={!from || !to || !date}
                >
                  Search Buses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GreenBus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  100% secure payment and verified bus operators for your peace of mind.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Comfortable Travel</h3>
                <p className="text-muted-foreground">
                  Modern buses with comfortable seating and premium amenities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Headphones className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Round-the-clock customer support for all your travel needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Routes</h2>
            <Link to="/search">
              <Button variant="outline">View All Routes</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockRoutes.map(route => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{route.from}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground my-1" />
                      <h3 className="font-semibold text-lg">{route.to}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{route.distance}</div>
                      <div className="text-sm text-muted-foreground">{route.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {route.popularTimes.map(time => (
                      <Badge key={time} variant="secondary" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => navigate("/search", { state: { from: route.from, to: route.to } })}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {testimonial.rating}/5
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.route}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GreenBus</h3>
              <p className="text-primary-foreground/80">
                Your trusted partner for comfortable and safe bus travel across India.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/search" className="hover:text-primary-foreground">Search Buses</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-foreground">My Bookings</Link></li>
                <li><a href="#" className="hover:text-primary-foreground">Help & Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Popular Cities</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Delhi</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Mumbai</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Bangalore</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>📞 1800-123-4567</li>
                <li>✉️ support@greenbus.com</li>
                <li>🕒 24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 GreenBus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;