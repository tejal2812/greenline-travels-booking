-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('confirmed', 'cancelled', 'pending', 'completed');

-- Create enum for seat status
CREATE TYPE public.seat_status AS ENUM ('available', 'booked', 'locked');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  distance INTEGER,
  duration INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bus operators table
CREATE TABLE public.bus_operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  rating DECIMAL(2,1) DEFAULT 4.0,
  total_buses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buses table
CREATE TABLE public.buses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_number TEXT NOT NULL UNIQUE,
  operator_id UUID NOT NULL REFERENCES public.bus_operators(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  travel_date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 40,
  available_seats INTEGER NOT NULL DEFAULT 40,
  bus_type TEXT DEFAULT 'AC Sleeper',
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seats table
CREATE TABLE public.seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  seat_type TEXT DEFAULT 'standard', -- standard, premium, sleeper
  position JSONB, -- {row: 1, column: 'A', level: 'lower'}
  status seat_status NOT NULL DEFAULT 'available',
  locked_until TIMESTAMP WITH TIME ZONE,
  locked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bus_id, seat_number)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
  seat_ids UUID[] NOT NULL,
  passenger_details JSONB NOT NULL, -- [{name, age, gender, email, phone}]
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  travel_date DATE NOT NULL,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table (mock)
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'mock_payment',
  transaction_id TEXT,
  status TEXT DEFAULT 'completed',
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'YB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for routes (public read, admin write)
CREATE POLICY "Anyone can view routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Admins can manage routes" ON public.routes FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for bus_operators (public read, admin write)
CREATE POLICY "Anyone can view bus operators" ON public.bus_operators FOR SELECT USING (true);
CREATE POLICY "Admins can manage bus operators" ON public.bus_operators FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for buses (public read, admin write)
CREATE POLICY "Anyone can view buses" ON public.buses FOR SELECT USING (true);
CREATE POLICY "Admins can manage buses" ON public.buses FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for seats (public read, authenticated users can update for booking)
CREATE POLICY "Anyone can view seats" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Authenticated users can lock seats" ON public.seats 
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage seats" ON public.seats FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid()
  ));
CREATE POLICY "Users can create payments for their bookings" ON public.payments
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid()
  ));
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email LIKE '%admin%' THEN 'admin'::user_role
      ELSE 'user'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update seat availability
CREATE OR REPLACE FUNCTION public.update_seat_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease available seats when booking is confirmed
    IF NEW.status = 'confirmed' THEN
      UPDATE public.buses 
      SET available_seats = available_seats - array_length(NEW.seat_ids, 1)
      WHERE id = NEW.bus_id;
      
      -- Update seat status to booked
      UPDATE public.seats 
      SET status = 'booked', updated_at = now()
      WHERE id = ANY(NEW.seat_ids);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle booking cancellation
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE public.buses 
      SET available_seats = available_seats + array_length(NEW.seat_ids, 1)
      WHERE id = NEW.bus_id;
      
      -- Update seat status back to available
      UPDATE public.seats 
      SET status = 'available', updated_at = now()
      WHERE id = ANY(NEW.seat_ids);
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for seat availability updates
CREATE TRIGGER update_seat_availability_trigger
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_seat_availability();

-- Create function to automatically release locked seats
CREATE OR REPLACE FUNCTION public.release_expired_seat_locks()
RETURNS void AS $$
BEGIN
  UPDATE public.seats 
  SET status = 'available', locked_until = NULL, locked_by = NULL, updated_at = now()
  WHERE status = 'locked' AND locked_until < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bus_operators_updated_at BEFORE UPDATE ON public.bus_operators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON public.buses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON public.seats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_buses_route_date ON public.buses(route_id, travel_date);
CREATE INDEX idx_buses_departure_time ON public.buses(departure_time);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX idx_seats_bus_id ON public.seats(bus_id);
CREATE INDEX idx_seats_status ON public.seats(status);
CREATE INDEX idx_routes_cities ON public.routes(from_city, to_city);