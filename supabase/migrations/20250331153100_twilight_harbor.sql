/*
  # Community Management Database Schema

  1. New Tables
    - `parking_spaces`: Tracks parking space availability and assignments
    - `facilities`: Community facilities like clubhouse, party rooms
    - `facility_bookings`: Reservations for community facilities
    - `emergency_contacts`: Security and medical emergency contacts
    - `announcements`: Community-wide announcements and notices
    - `maintenance_requests`: Repair and maintenance tracking
    - `access_passes`: Visitor and temporary access management
    - `visitors`: Visitor log and tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Implement role-based permissions
*/

-- Parking Management
CREATE TABLE IF NOT EXISTS parking_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_number text NOT NULL,
  type text NOT NULL CHECK (type IN ('resident', 'visitor', 'reserved')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  assigned_to uuid REFERENCES auth.users(id),
  vehicle_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parking_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parking spaces are viewable by all authenticated users"
  ON parking_spaces
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their assigned parking spaces"
  ON parking_spaces
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = assigned_to);

-- Facilities Management
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  capacity int,
  description text,
  rules text[],
  amenities text[],
  operating_hours jsonb,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Facilities are viewable by all authenticated users"
  ON facilities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS facility_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  purpose text,
  attendees_count int,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE facility_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all facility bookings"
  ON facility_bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own bookings"
  ON facility_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON facility_bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Emergency Management
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('security', 'medical', 'maintenance', 'other')),
  phone text NOT NULL,
  email text,
  available_hours jsonb,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Emergency contacts are viewable by all authenticated users"
  ON emergency_contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Communication Hub
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('general', 'emergency', 'maintenance', 'event')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  author_id uuid REFERENCES auth.users(id),
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are viewable by all authenticated users"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Maintenance Management
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('repair', 'replacement', 'inspection', 'other')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  submitted_by uuid REFERENCES auth.users(id),
  assigned_to uuid,
  location text NOT NULL,
  scheduled_date timestamptz,
  completed_date timestamptz,
  notes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all maintenance requests"
  ON maintenance_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create maintenance requests"
  ON maintenance_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own maintenance requests"
  ON maintenance_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by)
  WITH CHECK (auth.uid() = submitted_by);

-- Access Management
CREATE TABLE IF NOT EXISTS access_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_type text NOT NULL CHECK (pass_type IN ('guest', 'temporary', 'service', 'event')),
  issued_by uuid REFERENCES auth.users(id),
  issued_to jsonb NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  purpose text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  access_areas text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE access_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their issued passes"
  ON access_passes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = issued_by);

CREATE POLICY "Users can create access passes"
  ON access_passes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = issued_by);

CREATE POLICY "Users can update their issued passes"
  ON access_passes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = issued_by)
  WITH CHECK (auth.uid() = issued_by);

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  identification_type text NOT NULL,
  identification_number text NOT NULL,
  host_id uuid REFERENCES auth.users(id),
  access_pass_id uuid REFERENCES access_passes(id),
  check_in timestamptz,
  check_out timestamptz,
  purpose text,
  status text NOT NULL DEFAULT 'expected' CHECK (status IN ('expected', 'checked_in', 'checked_out', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their visitors"
  ON visitors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Users can create visitor entries"
  ON visitors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their visitor entries"
  ON visitors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_parking_spaces_status ON parking_spaces(status);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_facility_id ON facility_bookings(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_date_range ON facility_bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_announcements_valid_range ON announcements(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_passes_valid_range ON access_passes(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_visitors_host_id ON visitors(host_id);

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parking_spaces_updated_at
    BEFORE UPDATE ON parking_spaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
    BEFORE UPDATE ON facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_bookings_updated_at
    BEFORE UPDATE ON facility_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
    BEFORE UPDATE ON emergency_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
    BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_passes_updated_at
    BEFORE UPDATE ON access_passes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitors_updated_at
    BEFORE UPDATE ON visitors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();