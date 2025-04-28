// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'resident' | 'admin' | 'security' | 'maintenance';
  unit?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Resource Types
export type ResourceType = 
  | 'Tools'
  | 'Emergency'
  | 'Food'
  | 'Water'
  | 'Space'
  | 'Medical'
  | 'Traffic'
  | 'Power'
  | 'Communication'
  | 'Navigation'
  | 'Lighting'
  | 'Community'
  | 'Support'
  | 'Skills'
  | 'Networks';

// Parking Types
export interface ParkingSpace {
  id: string;
  spaceNumber: string;
  type: 'resident' | 'visitor' | 'reserved';
  status: 'available' | 'occupied' | 'maintenance';
  assignedTo?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  description: string;
  rules: string[];
  amenities: string[];
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  userId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeesCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Emergency Types
export interface EmergencyContact {
  id: string;
  name: string;
  type: 'security' | 'medical' | 'maintenance' | 'other';
  phone: string;
  email?: string;
  availableHours: {
    start: string;
    end: string;
    days: string[];
  };
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Communication Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'emergency' | 'maintenance' | 'event';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  authorId: string;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// Maintenance Types
export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  type: 'repair' | 'replacement' | 'inspection' | 'other';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  submittedBy: string;
  assignedTo?: string;
  location: string;
  scheduledDate?: string;
  completedDate?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

// Access Types
export interface AccessPass {
  id: string;
  passType: 'guest' | 'temporary' | 'service' | 'event';
  issuedBy: string;
  issuedTo: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
  };
  validFrom: string;
  validUntil: string;
  purpose: string;
  status: 'active' | 'expired' | 'revoked';
  accessAreas: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Visitor {
  id: string;
  name: string;
  identificationType: string;
  identificationNumber: string;
  hostId: string;
  accessPassId: string;
  checkIn?: string;
  checkOut?: string;
  purpose: string;
  status: 'expected' | 'checked_in' | 'checked_out' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface BookingFormData {
  facilityId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeesCount: number;
}

export interface MaintenanceFormData {
  title: string;
  description: string;
  type: string;
  priority: string;
  location: string;
  scheduledDate?: string;
}

export interface AccessPassFormData {
  passType: string;
  issuedTo: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
  };
  validFrom: string;
  validUntil: string;
  purpose: string;
  accessAreas: string[];
}