"use client";

import React, { createContext, useContext, useState } from "react";

// 1. Create the Context
const InvitationContext = createContext(undefined);

// Default structure tailored for the local market context
const initialInvitationData = {
  brideName: "Selam",
  groomName: "Dawit",
  brideParents: "Ato Tadesse & Woizero Almaz",
  groomParents: "Ato Berhanu & Woizero Aster",
  weddingDate: "2027-01-10",
  weddingTime: "12:00 PM",
  venueName: "Sheraton Addis",
  venueAddress: "T those Links St, Addis Ababa",
  personalMessage:
    "Our families joyfully request the honor of your presence to celebrate our holy matrimony.",
  templateId: "classic-ivory", // classic-ivory, modern-minimal, cultural-gold
  colorTheme: "gold-default",
};

// 2. Create the Provider Component
export function InvitationProvider({ children }) {
  const [invitationData, setInvitationData] = useState(initialInvitationData);

  // Helper function to update individual fields dynamically
  const updateField = (fieldName, value) => {
    setInvitationData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Reset function to clear back to defaults if needed
  const resetForm = () => setInvitationData(initialInvitationData);

  return (
    <InvitationContext.Provider
      value={{ invitationData, updateField, resetForm }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

// 3. Create a custom hook for clean, effortless imports in other components
export function useInvitation() {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error("useInvitation must be used within an InvitationProvider");
  }
  return context;
}
