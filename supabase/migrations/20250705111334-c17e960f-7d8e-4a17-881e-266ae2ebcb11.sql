-- Insert mock bus operators
INSERT INTO public.bus_operators (name, logo_url, rating, total_buses) VALUES
('GreenLine Express', '/placeholder.svg', 4.5, 25),
('SpeedBus', '/placeholder.svg', 4.2, 30),
('ComfortRide', '/placeholder.svg', 4.6, 20),
('EcoTransport', '/placeholder.svg', 4.3, 18),
('PremiumBus', '/placeholder.svg', 4.7, 15),
('CityConnect', '/placeholder.svg', 4.1, 22),
('RapidTravel', '/placeholder.svg', 4.4, 28),
('LuxuryLines', '/placeholder.svg', 4.8, 12),
('SafeJourney', '/placeholder.svg', 4.5, 16),
('QuickTransit', '/placeholder.svg', 4.0, 24);

-- Insert mock routes
INSERT INTO public.routes (from_city, to_city, distance, duration) VALUES
('Delhi', 'Jaipur', 280, 300),
('Mumbai', 'Pune', 150, 180),
('Bangalore', 'Chennai', 350, 360),
('Hyderabad', 'Vijayawada', 270, 300),
('Kolkata', 'Bhubaneswar', 440, 480),
('Ahmedabad', 'Udaipur', 260, 240),
('Kochi', 'Trivandrum', 200, 240),
('Indore', 'Bhopal', 190, 180),
('Lucknow', 'Kanpur', 80, 120),
('Chandigarh', 'Amritsar', 230, 240),
('Goa', 'Mumbai', 460, 480),
('Mysore', 'Bangalore', 150, 180),
('Coimbatore', 'Chennai', 360, 420),
('Jaipur', 'Jodhpur', 340, 360),
('Agra', 'Delhi', 230, 240);

-- Insert mock buses for today and next few days
INSERT INTO public.buses (bus_number, operator_id, route_id, departure_time, arrival_time, travel_date, price, total_seats, available_seats, bus_type, amenities)
SELECT 
  CONCAT(bo.name, '-', LPAD((ROW_NUMBER() OVER())::TEXT, 3, '0')),
  bo.id,
  r.id,
  CASE (ROW_NUMBER() OVER() % 6)
    WHEN 0 THEN '06:00'::TIME
    WHEN 1 THEN '09:30'::TIME
    WHEN 2 THEN '14:00'::TIME
    WHEN 3 THEN '18:30'::TIME
    WHEN 4 THEN '22:00'::TIME
    ELSE '23:30'::TIME
  END,
  CASE (ROW_NUMBER() OVER() % 6)
    WHEN 0 THEN '11:00'::TIME
    WHEN 1 THEN '12:30'::TIME
    WHEN 2 THEN '18:00'::TIME
    WHEN 3 THEN '23:30'::TIME
    WHEN 4 THEN '04:00'::TIME
    ELSE '05:30'::TIME
  END,
  CURRENT_DATE + ((ROW_NUMBER() OVER() % 7)::TEXT || ' days')::INTERVAL,
  CASE (ROW_NUMBER() OVER() % 4)
    WHEN 0 THEN 800.00
    WHEN 1 THEN 1200.00
    WHEN 2 THEN 1500.00
    ELSE 2000.00
  END,
  CASE (ROW_NUMBER() OVER() % 3)
    WHEN 0 THEN 32
    WHEN 1 THEN 40
    ELSE 44
  END,
  CASE (ROW_NUMBER() OVER() % 3)
    WHEN 0 THEN 25
    WHEN 1 THEN 35
    ELSE 38
  END,
  CASE (ROW_NUMBER() OVER() % 4)
    WHEN 0 THEN 'AC Seater'
    WHEN 1 THEN 'AC Sleeper'
    WHEN 2 THEN 'Non-AC Seater'
    ELSE 'Luxury AC'
  END,
  CASE (ROW_NUMBER() OVER() % 3)
    WHEN 0 THEN ARRAY['WiFi', 'Charging Point', 'Water Bottle']
    WHEN 1 THEN ARRAY['WiFi', 'Blanket', 'Pillow', 'Charging Point']
    ELSE ARRAY['WiFi', 'Entertainment', 'Snacks', 'Charging Point', 'Reading Light']
  END
FROM public.bus_operators bo
CROSS JOIN public.routes r
WHERE (ROW_NUMBER() OVER()) <= 100;

-- Generate seats for each bus
INSERT INTO public.seats (bus_id, seat_number, seat_type, position, status)
SELECT 
  b.id,
  CASE 
    WHEN b.bus_type = 'AC Sleeper' THEN
      CASE 
        WHEN seat_num <= b.total_seats/2 THEN 'L' || ((seat_num-1)/2 + 1)::TEXT || CASE WHEN seat_num % 2 = 1 THEN 'L' ELSE 'U' END
        ELSE 'R' || ((seat_num - b.total_seats/2 - 1)/2 + 1)::TEXT || CASE WHEN (seat_num - b.total_seats/2) % 2 = 1 THEN 'L' ELSE 'U' END
      END
    ELSE seat_num::TEXT
  END,
  CASE 
    WHEN seat_num <= 4 THEN 'premium'
    WHEN seat_num > b.total_seats - 4 THEN 'premium'
    ELSE 'standard'
  END,
  jsonb_build_object(
    'row', ((seat_num-1) / CASE WHEN b.bus_type = 'AC Sleeper' THEN 2 ELSE 4 END) + 1,
    'column', CASE WHEN b.bus_type = 'AC Sleeper' THEN 
                CASE WHEN seat_num <= b.total_seats/2 THEN 'L' ELSE 'R' END
              ELSE 
                CASE (seat_num-1) % 4 
                  WHEN 0 THEN 'A' 
                  WHEN 1 THEN 'B' 
                  WHEN 2 THEN 'C' 
                  ELSE 'D' 
                END
              END,
    'level', CASE WHEN b.bus_type = 'AC Sleeper' THEN 
                CASE WHEN seat_num % 2 = 1 THEN 'lower' ELSE 'upper' END
              ELSE 'single'
            END
  ),
  CASE 
    WHEN RANDOM() < 0.3 THEN 'booked'::seat_status
    ELSE 'available'::seat_status
  END
FROM public.buses b
CROSS JOIN generate_series(1, (SELECT MAX(total_seats) FROM public.buses)) AS seat_num
WHERE seat_num <= b.total_seats;