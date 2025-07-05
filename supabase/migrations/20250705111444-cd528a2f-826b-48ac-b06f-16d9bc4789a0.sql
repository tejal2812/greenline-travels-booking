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

-- Insert mock buses (simplified approach)
WITH bus_data AS (
  SELECT 
    bo.id as operator_id,
    bo.name as operator_name,
    r.id as route_id,
    r.from_city,
    r.to_city,
    generate_series(1, 3) as bus_sequence, -- 3 buses per route
    generate_series(0, 6) as day_offset -- Next 7 days
  FROM public.bus_operators bo
  CROSS JOIN public.routes r
  LIMIT 150 -- Limit total combinations
)
INSERT INTO public.buses (bus_number, operator_id, route_id, departure_time, arrival_time, travel_date, price, total_seats, available_seats, bus_type, amenities)
SELECT 
  operator_name || '-' || LPAD(bus_sequence::TEXT, 3, '0'),
  operator_id,
  route_id,
  CASE (bus_sequence % 6)
    WHEN 1 THEN '06:00'::TIME
    WHEN 2 THEN '09:30'::TIME
    WHEN 3 THEN '14:00'::TIME
    WHEN 4 THEN '18:30'::TIME
    WHEN 5 THEN '22:00'::TIME
    ELSE '23:30'::TIME
  END,
  CASE (bus_sequence % 6)
    WHEN 1 THEN '11:00'::TIME
    WHEN 2 THEN '12:30'::TIME
    WHEN 3 THEN '18:00'::TIME
    WHEN 4 THEN '23:30'::TIME
    WHEN 5 THEN '04:00'::TIME
    ELSE '05:30'::TIME
  END,
  CURRENT_DATE + (day_offset || ' days')::INTERVAL,
  CASE (bus_sequence % 4)
    WHEN 1 THEN 800.00
    WHEN 2 THEN 1200.00
    WHEN 3 THEN 1500.00
    ELSE 2000.00
  END,
  CASE (bus_sequence % 3)
    WHEN 1 THEN 32
    WHEN 2 THEN 40
    ELSE 44
  END,
  CASE (bus_sequence % 3)
    WHEN 1 THEN 25
    WHEN 2 THEN 35
    ELSE 38
  END,
  CASE (bus_sequence % 4)
    WHEN 1 THEN 'AC Seater'
    WHEN 2 THEN 'AC Sleeper'
    WHEN 3 THEN 'Non-AC Seater'
    ELSE 'Luxury AC'
  END,
  CASE (bus_sequence % 3)
    WHEN 1 THEN ARRAY['WiFi', 'Charging Point', 'Water Bottle']
    WHEN 2 THEN ARRAY['WiFi', 'Blanket', 'Pillow', 'Charging Point']
    ELSE ARRAY['WiFi', 'Entertainment', 'Snacks', 'Charging Point', 'Reading Light']
  END
FROM bus_data
WHERE day_offset = 0; -- Only insert for today initially