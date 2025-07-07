import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const Booking = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Mock data - replace with actual data fetching
  const bus = {
    id: "mock-bus-1",
    operator: "RedBus Express",
    busType: "AC Sleeper",
    from: "Delhi",
    to: "Jaipur", 
    departureTime: "22:00"
  };
  const selectedSeats: string[] = ["1A", "1B"];
  const totalAmount = 800;
  const journeyDate = "2025-01-10";
  
  const [passengerInfo, setPassengerInfo] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    gender: "male"
  });
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bus || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid booking request</h2>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!passengerInfo.name || !passengerInfo.email || !passengerInfo.phone || !agreeTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and agree to terms.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      const ticketId = `TKT${Date.now()}`;
      
      toast({
        title: "Booking Confirmed!",
        description: `Your ticket ${ticketId} has been booked successfully.`,
      });
      
      setLocation("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to={`/bus/${bus.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Seat Selection
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passenger Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={passengerInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={passengerInfo.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={passengerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={passengerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={passengerInfo.gender} 
                    onValueChange={(value) => handleInputChange("gender", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <Label htmlFor="card" className="font-medium">Credit/Debit Card</Label>
                      <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <Label htmlFor="upi" className="font-medium">UPI Payment</Label>
                      <p className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, etc.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <Label htmlFor="wallet" className="font-medium">Digital Wallet</Label>
                      <p className="text-sm text-muted-foreground">Paytm, Amazon Pay, etc.</p>
                    </div>
                  </div>
                </RadioGroup>
                
                <div className="mt-6 flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <span className="text-primary underline cursor-pointer">Terms & Conditions</span>
                    {" "}and{" "}
                    <span className="text-primary underline cursor-pointer">Privacy Policy</span>
                  </Label>
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
                <div className="space-y-2">
                  <h4 className="font-medium">{bus.operator}</h4>
                  <p className="text-sm text-muted-foreground">{bus.busType}</p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-medium">{bus.from} → {bus.to}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{journeyDate}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{bus.departureTime}</span>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Selected Seats:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSeats.map((seat: string) => (
                      <Badge key={seat} variant="secondary">{seat}</Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Base Fare ({selectedSeats.length} seats):</span>
                  <span>₹{totalAmount}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees:</span>
                  <span>₹0</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>100% Secure Payment</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;