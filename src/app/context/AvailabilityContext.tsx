import React, { ReactNode, createContext, useContext, useState } from "react";
import { CLEANERS, Cleaner } from "../constants/cleaners";

interface AvailabilityContextType {
  availableCleaners: Cleaner[];
  updateCleanerAvailability: (cleanerId: string, isAvailable: boolean) => void;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export const AvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [availableCleaners, setAvailableCleaners] = useState<Cleaner[]>(CLEANERS);

  const updateCleanerAvailability = (cleanerId: string, isAvailable: boolean) => {
    setAvailableCleaners((prevCleaners) =>
      prevCleaners.map((cleaner) =>
        cleaner.id === cleanerId ? { ...cleaner, isAvailable } : cleaner
      )
    );
  };

  return (
    <AvailabilityContext.Provider value={{ availableCleaners, updateCleanerAvailability }}>
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return context;
};