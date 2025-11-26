"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { BookingData, AddOns, CustomerInfo, Pricing } from "@/types/booking";
import { BOOKING_FEE } from "@/lib/constants";

interface BookingContextType {
  bookingData: BookingData;
  updateProduct: (product: BookingData["product"]) => void;
  updateDateTime: (date: string, timeBlock: BookingData["timeBlock"]) => void;
  updatePackage: (pkg: BookingData["package"], price: number) => void;
  updateAddOns: (addOns: AddOns) => void;
  updateCustomer: (customer: CustomerInfo) => void;
  updateBookingId: (bookingId: string, paymentIntentId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialAddOns: AddOns = {
  playlistProjector: false,
  extraHour: false,
  glowBags: false,
};

const initialPricing: Pricing = {
  subtotal: 0,
  bookingFee: BOOKING_FEE,
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

  const updateDateTime = (date: string, timeBlock: BookingData["timeBlock"]) => {
    setBookingData((prev) => ({ ...prev, date, timeBlock }));
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
          total: newSubtotal + BOOKING_FEE,
        },
      };
    });
  };

  const updateAddOns = (addOns: AddOns) => {
    setBookingData((prev) => {
      // Calculate add-on prices
      let addOnTotal = 0;
      if (addOns.playlistProjector) addOnTotal += 100;
      if (addOns.extraHour) addOnTotal += 75;
      if (addOns.glowBags) addOnTotal += 50;

      // Get base package price from current subtotal
      const basePackagePrice = prev.pricing.subtotal - (
        (prev.addOns.playlistProjector ? 100 : 0) +
        (prev.addOns.extraHour ? 75 : 0) +
        (prev.addOns.glowBags ? 50 : 0)
      );

      const newSubtotal = basePackagePrice + addOnTotal;

      return {
        ...prev,
        addOns,
        pricing: {
          ...prev.pricing,
          subtotal: newSubtotal,
          total: newSubtotal + BOOKING_FEE,
        },
      };
    });
  };

  const updateCustomer = (customer: CustomerInfo) => {
    setBookingData((prev) => ({ ...prev, customer }));
  };

  const updateBookingId = (bookingId: string, paymentIntentId: string) => {
    setBookingData((prev) => ({ ...prev, bookingId, paymentIntentId }));
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

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateProduct,
        updateDateTime,
        updatePackage,
        updateAddOns,
        updateCustomer,
        updateBookingId,
        nextStep,
        prevStep,
        goToStep,
        resetBooking,
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
