-- Create a secure table for user profiles that links to Supabase Auth
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (or restrict to just their own if needed)
CREATE POLICY "Profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create table for Emergency Contacts
CREATE TABLE public.emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Emergency contacts are viewable by everyone." ON public.emergency_contacts FOR SELECT USING (true);

-- Create table for Admin Dashboard Telemetry
CREATE TABLE public.admin_telemetry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  preparedness_score NUMERIC NOT NULL,
  students_trained INTEGER NOT NULL,
  drills_completed INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Telemetry is viewable by everyone." ON public.admin_telemetry FOR SELECT USING (true);

-- Create table for Chart Data: Participation by Grade
CREATE TABLE public.participation_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  participation INTEGER NOT NULL
);

ALTER TABLE public.participation_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participation stats are viewable by everyone." ON public.participation_stats FOR SELECT USING (true);

-- Create table for Chart Data: Preparedness by Disaster
CREATE TABLE public.preparedness_radar_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  full_mark INTEGER NOT NULL
);

ALTER TABLE public.preparedness_radar_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Preparedness radar stats are viewable by everyone." ON public.preparedness_radar_stats FOR SELECT USING (true);

-- ==========================================
-- SEED DATA (For initial testing)
-- ==========================================

INSERT INTO public.emergency_contacts (name, number) VALUES
('National Emergency', '112'),
('Police', '100'),
('Fire Brigade', '101'),
('Ambulance', '102'),
('Disaster Management Services', '108');

INSERT INTO public.admin_telemetry (preparedness_score, students_trained, drills_completed) VALUES
(85, 1250, 24);

INSERT INTO public.participation_stats (name, participation) VALUES
('Grade 1', 100), ('Grade 2', 120), ('Grade 3', 95), ('Grade 4', 110), ('Grade 5', 150);

INSERT INTO public.preparedness_radar_stats (subject, score, full_mark) VALUES
('Earthquake', 85, 100), ('Fire', 90, 100), ('Flood', 65, 100), ('Cyclone', 70, 100), ('Tsunami', 45, 100);
