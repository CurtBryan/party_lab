"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { BookingProvider, useBooking } from "./booking-context";
import { ProgressIndicator } from "./progress-indicator";
import { Button } from "@/components/ui/button";
import type { InitialBookingData } from "@/types/booking";

// Import screens - New flow: Venue → Experience → Date → Info → Payment → Done
import { Screen1Product } from "./screen-1-product";
import { Screen2Experience } from "./screen-2-experience";
import { Screen2DateTime } from "./screen-2-datetime";
import { Screen5Customer } from "./screen-5-customer";
import { Screen6Payment } from "./screen-6-payment";
import { Screen7Confirmation } from "./screen-7-confirmation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialBookingData;
}

function BookingModalContent({ onClose }: { onClose: () => void }) {
  const { bookingData, prevStep, goToStep, isStepCompleted } = useBooking();
  const { currentStep } = bookingData;
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  // New flow: 1-Venue, 2-Experience, 3-Date, 4-Info, 5-Payment, 6-Done
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Screen1Product />;
      case 2:
        return <Screen2Experience />;
      case 3:
        return <Screen2DateTime />;
      case 4:
        return <Screen5Customer />;
      case 5:
        return <Screen6Payment />;
      case 6:
        return <Screen7Confirmation onClose={onClose} />;
      default:
        return <Screen1Product />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-lg shadow-2xl overflow-hidden border-2 border-primary glow-purple">
        {/* Close button */}
        {currentStep !== 6 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all"
            aria-label="Close booking"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div ref={contentRef} className="overflow-y-auto max-h-[90vh] p-6 sm:p-8">
          {/* Progress indicator */}
          {currentStep !== 6 && (
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={6}
              onStepClick={goToStep}
              isStepCompleted={isStepCompleted}
            />
          )}

          {/* Step content */}
          <div className="mt-6">{renderStep()}</div>

          {/* Back button (not on first or last step) */}
          {currentStep > 1 && currentStep < 6 && (
            <div className="mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                className="w-full sm:w-auto"
              >
                ← Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookingModal({ isOpen, onClose, initialData }: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <BookingProvider initialData={initialData}>
      <BookingModalContent onClose={onClose} />
    </BookingProvider>
  );
}
