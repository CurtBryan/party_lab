"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { BookingData, AddOns, CustomerInfo, Pricing } from "@/types/booking";
import { BOOKING_FEE } from "@/lib/constants";

interface BookingContextType {
  bookingData: BookingData;
  updateProduct: (product: BookingData["product"]) => void;
  updateDateTime: (date: string, timeBlock: BookingData["timeBlock"], extraHours?: number) => void;
  updatePackage: (pkg: BookingData["package"], price: number) => void;
  updateAddOns: (addOns: AddOns) => void;
  updateCustomer: (customer: CustomerInfo) => void;
  updateTripCharge: (tripCharge: number) => void;
  updateBookingId: (bookingId: string, paymentIntentId: string, clientSecret?: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetBooking: () => void;
  isStepCompleted: (step: number) => boolean;
  arePreviousStepsCompleted: (step: number) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialAddOns: AddOns = {
  playlistProjector: false,
  redRopesCarpet: false,
  extraHour: false,
  glowBags: false,
  themedVideoProjector: false,
};

const initialPricing: Pricing = {
  subtotal: 0,
  bookingFee: BOOKING_FEE,
  extraHours: 0,
  extraHoursCost: 0,
  tripCharge: 0,
  total: BOOKING_FEE,
};

const initialBookingData: BookingData = {
  currentStep: 1,
  product: null,
  date: null,
  timeBlock: null,
  package: null,
  addOns: initialAddOns,
  customer: null,
  pricing: initialPricing,
  bookingId: null,
  paymentIntentId: null,
  clientSecret: null,
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("partylab_booking");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBookingData(parsed);
      } catch (error) {
        console.error("Failed to parse saved booking data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever bookingData changes
  useEffect(() => {
    if (bookingData.currentStep > 1 || bookingData.product) {
      localStorage.setItem("partylab_booking", JSON.stringify(bookingData));
    }
  }, [bookingData]);

  const updateProduct = (product: BookingData["product"]) => {
    setBookingData((prev) => ({ ...prev, product }));
  };

  const updateDateTime = (date: string, timeBlock: BookingData["timeBlock"], extraHours: number = 0) => {
    setBookingData((prev) => {
      // Tiered pricing: $50 for first extra hour, $75 for each additional hour
      let extraHoursCost = 0;
      if (extraHours === 1) {
        extraHoursCost = 50;
      } else if (extraHours > 1) {
        extraHoursCost = 50 + (75 * (extraHours - 1));
      }

      const currentAddOnsCost =
        (prev.addOns.themedVideoProjector ? 100 : 0) +
        (prev.addOns.playlistProjector ? 100 : 0) +
        (prev.addOns.extraHour ? 50 : 0) +
        (prev.addOns.glowBags ? 50 : 0);

      const basePackagePrice = prev.pricing.subtotal - currentAddOnsCost - prev.pricing.extraHoursCost;
      const newSubtotal = basePackagePrice + currentAddOnsCost + extraHoursCost;

      return {
        ...prev,
        date,
        timeBlock,
        pricing: {
          ...prev.pricing,
          extraHours,
          extraHoursCost,
          subtotal: newSubtotal,
          total: newSubtotal,
        },
      };
    });
  };

  const updatePackage = (pkg: BookingData["package"], price: number) => {
    setBookingData((prev) => {
      const newSubtotal = price;
      return {
        ...prev,
        package: pkg,
        pricing: {
          ...prev.pricing,
          subtotal: newSubtotal,
          total: newSubtotal, // Package price already includes booking fee
        },
      };
    });
  };

  const updateAddOns = (addOns: AddOns) => {
    setBookingData((prev) => {
      // Calculate add-on prices
      let addOnTotal = 0;
      if (addOns.themedVideoProjector) addOnTotal += 100;
      if (addOns.playlistProjector) addOnTotal += 100;
      if (addOns.extraHour) addOnTotal += 50;
      if (addOns.glowBags) addOnTotal += 50;

      // Get base package price from current subtotal (excluding previous add-ons and extra hours)
      const previousAddOnsCost =
        (prev.addOns.themedVideoProjector ? 100 : 0) +
        (prev.addOns.playlistProjector ? 100 : 0) +
        (prev.addOns.extraHour ? 50 : 0) +
        (prev.addOns.glowBags ? 50 : 0);

      const basePackagePrice = prev.pricing.subtotal - previousAddOnsCost - prev.pricing.extraHoursCost;

      const newSubtotal = basePackagePrice + addOnTotal + prev.pricing.extraHoursCost;

      return {
        ...prev,
        addOns,
        pricing: {
          ...prev.pricing,
          subtotal: newSubtotal,
          total: newSubtotal, // Package price already includes booking fee
        },
      };
    });
  };

  const updateCustomer = (customer: CustomerInfo) => {
    setBookingData((prev) => ({ ...prev, customer }));
  };

  const updateTripCharge = (tripCharge: number) => {
    setBookingData((prev) => {
      const newTotal = prev.pricing.subtotal + tripCharge;
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          tripCharge,
          total: newTotal,
        },
      };
    });
  };

  const updateBookingId = (bookingId: string, paymentIntentId: string, clientSecret?: string) => {
    setBookingData((prev) => ({
      ...prev,
      bookingId,
      paymentIntentId,
      ...(clientSecret && { clientSecret })
    }));
  };

  const nextStep = () => {
    setBookingData((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 7) }));
  };

  const prevStep = () => {
    setBookingData((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  };

  const goToStep = (step: number) => {
    setBookingData((prev) => ({ ...prev, currentStep: step }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
    localStorage.removeItem("partylab_booking");
  };

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1: // Product
        return bookingData.product !== null;
      case 2: // Date & Time
        return bookingData.date !== null && bookingData.timeBlock !== null;
      case 3: // Package
        return bookingData.package !== null;
      case 4: // Add-Ons (complete if user has moved past this step)
        return bookingData.currentStep > 4;
      case 5: // Customer Info
        return bookingData.customer !== null;
      case 6: // Payment
        return bookingData.bookingId !== null;
      case 7: // Confirmation
        return bookingData.bookingId !== null;
      default:
        return false;
    }
  };

  const arePreviousStepsCompleted = (step: number): boolean => {
    // Check if all steps before the given step are completed
    for (let i = 1; i < step; i++) {
      if (!isStepCompleted(i)) {
        return false;
      }
    }
    return true;
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateProduct,
        updateDateTime,
        updatePackage,
        updateAddOns,
        updateCustomer,
        updateTripCharge,
        updateBookingId,
        nextStep,
        prevStep,
        goToStep,
        resetBooking,
        isStepCompleted,
        arePreviousStepsCompleted,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
