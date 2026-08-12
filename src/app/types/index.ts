// ... existing Cleaner, CustomerProfile, Booking, Review interfaces ...
// ADD THESE BELOW:

export type MaritalStatus = "Married" | "Unmarried";
export type RateType = "Per Hour" | "Per Day" | "Per Job";
export type AvailabilityType = "Full Time" | "Part Time" | "Flexible";
export type ApplicationStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Suspended";

export interface PartnerDocuments {
  // Own CNIC
  cnicFrontUri: string;
  cnicBackUri: string;
  
  // Spouse/Parent (Conditional)
  beneficiaryName: string;
  beneficiaryRelation: "Father" | "Mother" | "Other Guardian" | "Husband";
  beneficiaryCnicFrontUri: string;
  beneficiaryCnicBackUri: string;
  
  // Profile Photos
  profilePhoto1Uri: string;
  profilePhoto2Uri: string;
}

export interface PartnerAvailability {
  maxHoursPerDay: number; // e.g. 8
  availabilityType: AvailabilityType;
}

export interface PartnerApplication {
  id?: string; // Firebase auto-id
  userId: string; // Auth UID
  
  // Step 1
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  maritalStatus: MaritalStatus;
  phone: string;
  address: string;
  city: string;
  area: string;
  locationCoords?: { latitude: number; longitude: number };
  
  // Step 5
  services: string[]; // Array of selected services
  
  // Step 6
  availability: PartnerAvailability;
  
  // Step 7
  expectedPay: number;
  rateType: RateType;
  
  // Step 8
  experience: string;
  experienceDetails?: string;
  
  // Step 9
  languages: string[];
  
  // Sensitive Data (Step 2, 3, 4)
  documents: PartnerDocuments;
  
  // Meta
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  consentGiven: boolean;
}

// For the Public Profile (After Approval)
export interface PartnerProfile {
  id: string;
  userId: string;
  fullName: string;
  gender: "Male" | "Female";
  rating: number;
  profilePhotoUri: string;
  services: string[];
  languages: string[];
  experience: string;
  availability: PartnerAvailability;
  expectedPay: number;
  rateType: RateType;
  city: string;
  area: string;
  jobsCompleted: number;
  isAvailable: boolean;
}