import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Star, ArrowRight, Bus as BusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockBuses, cities, type Bus } from "@/lib/mockData";
import { Link } from "react-router-dom";

const Search = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [searchResults, setSearchResults] = useState<Bus[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = () => {
    // Filter buses based on from/to cities
    const results = mockBuses.filter(bus => 
      bus.from.toLowerCase().includes(from.toLowerCase()) &&
      bus.to.toLowerCase().includes(to.toLowerCase())
    );
    
    // Sort results
    const sortedResults = [...results].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "departure":
          return a.departureTime.localeCompare(b.departureTime);
        default:
          return 0;
      }
    });
    
    setSearchResults(sortedResults);
    setIsSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Find Your Bus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Journey Date</Label>
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
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
              
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                  disabled={!from || !to || !date}
                >
                  <BusIcon className="mr-2 h-4 w-4" />
                  Search Buses
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sort */}
        {isSearched && (
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="departure">Departure Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {searchResults.length} buses found
            </div>
          </div>
        )}

        {/* Search Results */}
        {isSearched && (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map(bus => (
                <Card key={bus.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{bus.operator}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{bus.rating}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{bus.from} → {bus.to}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{bus.departureTime} - {bus.arrivalTime}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Duration: {bus.duration}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {bus.amenities.map(amenity => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {bus.seatsAvailable} seats available • {bus.busType}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 lg:ml-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₹{bus.price}</div>
                          <div className="text-sm text-muted-foreground">per seat</div>
                        </div>
                        <Link to={`/bus/${bus.id}`}>
                          <Button className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary">
                            Select Seats
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BusIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No buses found</h3>
                  <p className="text-muted-foreground">
                    Try searching for a different route or date.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;