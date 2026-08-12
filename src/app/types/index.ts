// ==========================================
// 1. CLEANER INTERFACE
// ==========================================
export interface Cleaner {
  id: string;
  name: string;
  gender: "Male" | "Female";
  rating: number;
  avatar: string; // URL or local require
  jobsCompleted: number;
  experience: string; // e.g. "2 Years"
  services: string[]; // e.g. ["Home Cleaning", "Deep Cleaning"]
  isAvailable: boolean;
  pricePerHour: number;
}

// ==========================================
// 2. CUSTOMER PROFILE INTERFACE
// ==========================================
export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  savedAddresses: string[];
}

// ==========================================
// 3. BOOKING INTERFACE (Ready for Database)
// ==========================================
export interface Booking {
  id: string;
  customerId: string;
  cleanerId: string;
  serviceType: string;    // e.g. "Home Cleaning"
  packageType: string;    // e.g. "Premium", "Standard"
  price: number;
  date: string;           // Stored as ISO string or "YYYY-MM-DD"
  time: string;           // e.g. "10:00 AM"
  address: string;
  status: 
    | "Pending" 
    | "Accepted" 
    | "Cleaner Assigned" 
    | "On The Way" 
    | "Cleaning Started" 
    | "Completed" 
    | "Cancelled";
  specialInstructions?: string; // Optional
  review?: Review;              // Optional, nested object
}

// ==========================================
// 4. REVIEW INTERFACE
// ==========================================
export interface Review {
  id: string;
  bookingId: string;
  cleanerId: string;
  customerId: string;
  rating: number;         // 1 to 5
  comment: string;
  date: string;           // ISO date string
}