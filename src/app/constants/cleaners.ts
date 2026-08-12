export interface Cleaner {
  id: string;
  name: string;
  gender: "Male" | "Female";
  rating: number;
  avatar: string; 
  jobsCompleted: number;
  experience: string; 
  services: string[];
  isAvailable: boolean;
  pricePerHour: number;
  // NEW: Coordinates for the map
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export const CLEANERS: Cleaner[] = [
  // Male Cleaners
  {
    id: "c1",
    name: "Ali Khan",
    gender: "Male",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=11",
    jobsCompleted: 142,
    experience: "3 Years",
    services: ["Home Cleaning", "Office Cleaning"],
    isAvailable: true,
    pricePerHour: 500,
    coordinate: { latitude: 24.8607, longitude: 67.0011 } // Karachi
  },
  {
    id: "c2",
    name: "Ahmed Raza",
    gender: "Male",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?img=12",
    jobsCompleted: 98,
    experience: "2 Years",
    services: ["Deep Cleaning", "Office Cleaning"],
    isAvailable: true,
    pricePerHour: 600,
    coordinate: { latitude: 24.8615, longitude: 67.0099 }
  },
  {
    id: "c3",
    name: "Usman Ali",
    gender: "Male",
    rating: 5.0,
    avatar: "https://i.pravatar.cc/150?img=13",
    jobsCompleted: 210,
    experience: "4 Years",
    services: ["Home Cleaning", "Deep Cleaning", "Office Cleaning"],
    isAvailable: false, 
    pricePerHour: 700,
    coordinate: { latitude: 24.8520, longitude: 67.0150 }
  },
  {
    id: "c4",
    name: "Hamza Ahmed",
    gender: "Male",
    rating: 4.7,
    avatar: "https://i.pravatar.cc/150?img=14",
    jobsCompleted: 65,
    experience: "1 Year",
    services: ["Home Cleaning"],
    isAvailable: true,
    pricePerHour: 450,
    coordinate: { latitude: 24.8780, longitude: 67.0300 }
  },
  // Female Cleaners
  {
    id: "c5",
    name: "Ayesha Khan",
    gender: "Female",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=5",
    jobsCompleted: 156,
    experience: "3 Years",
    services: ["Home Cleaning", "Deep Cleaning"],
    isAvailable: true,
    pricePerHour: 550,
    coordinate: { latitude: 24.8700, longitude: 67.0200 }
  },
  {
    id: "c6",
    name: "Sana Ahmed",
    gender: "Female",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?img=9",
    jobsCompleted: 87,
    experience: "2 Years",
    services: ["Deep Cleaning", "Office Cleaning"],
    isAvailable: true,
    pricePerHour: 580,
    coordinate: { latitude: 24.8650, longitude: 67.0050 }
  },
  {
    id: "c7",
    name: "Fatima Ali",
    gender: "Female",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=1",
    jobsCompleted: 120,
    experience: "2.5 Years",
    services: ["Home Cleaning", "Office Cleaning"],
    isAvailable: true,
    pricePerHour: 520,
    coordinate: { latitude: 24.8800, longitude: 67.0250 }
  },
  {
    id: "c8",
    name: "Maryam Raza",
    gender: "Female",
    rating: 5.0,
    avatar: "https://i.pravatar.cc/150?img=10",
    jobsCompleted: 185,
    experience: "3 Years",
    services: ["Deep Cleaning", "Office Cleaning"],
    isAvailable: false, 
    pricePerHour: 650,
    coordinate: { latitude: 24.8900, longitude: 67.0400 }
  },
];