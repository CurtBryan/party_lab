"use client";

import { useState } from "react";
import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/package-card";
import { PACKAGES } from "@/lib/constants";
import type { PackageType } from "@/types/booking";
import { ExtraHoursModal } from "./extra-hours-modal";

export function Screen3Package() {
  const { bookingData, updatePackage, updateDateTime, nextStep, prevStep } = useBooking();
  const [showExtraHoursModal, setShowExtraHoursModal] = useState(false);
  const [pendingPackage, setPendingPackage] = useState<PackageType | null>(null);

  // Get product-specific pricing
  const getPackagePrice = (packageName: PackageType): number => {
    const isDanceDome = bookingData.product === "Dance Dome";

    switch (packageName) {
      case "Party Starter":
        return isDanceDome ? 250 : 300;
      case "Glow Getter":
        return isDanceDome ? 325 : 400;
      case "All-Star VIP":
        return isDanceDome ? 400 : 500;
      default:
        return 300;
    }
  };

  // Calculate duration from time block
  const calculateDuration = (timeBlock: string | null): number => {
    if (!timeBlock) return 0;
    const [startTime, endTime] = timeBlock.split("-");
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const durationMs = end.getTime() - start.getTime();
    return durationMs / (1000 * 60 * 60);
  };

  // Calculate extra hours cost with tiered pricing
  const calculateExtraHoursCost = (extraHours: number): number => {
    if (extraHours === 1) {
      return 50;
    } else if (extraHours > 1) {
      return 50 + 75 * (extraHours - 1);
    }
    return 0;
  };

  const handleSelect = (packageName: PackageType) => {
    const price = getPackagePrice(packageName);
    updatePackage(packageName, price);
  };

  const handleContinue = () => {
    if (!bookingData.package) return;

    const duration = calculateDuration(bookingData.timeBlock);
    const extraHours = duration > 3 ? Math.ceil(duration - 3) : 0;

    // Check if package needs extra hours charge
    const needsExtraHoursCharge =
      extraHours > 0 &&
      (bookingData.package === "Party Starter" || bookingData.package === "Glow Getter");

    if (needsExtraHoursCharge) {
      // Show modal for Party Starter or Glow Getter with >3 hours
      setPendingPackage(bookingData.package);
      setShowExtraHoursModal(true);
    } else {
      // All-Star VIP or ≤3 hours: proceed normally
      if (extraHours > 0 && bookingData.package === "All-Star VIP") {
        // Make sure extra hours cost is 0 for All-Star VIP
        updateDateTime(bookingData.date!, bookingData.timeBlock!, 0);
      }
      nextStep();
    }
  };

  const handleConfirmExtraHours = () => {
    if (!bookingData.timeBlock || !bookingData.date) return;

    const duration = calculateDuration(bookingData.timeBlock);
    const extraHours = Math.ceil(duration - 3);

    // Update booking with extra hours cost
    updateDateTime(bookingData.date, bookingData.timeBlock, extraHours);
    setShowExtraHoursModal(false);
    nextStep();
  };

  const handleChangePackage = () => {
    setShowExtraHoursModal(false);
    // User stays on this screen to pick a different package
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-glow-purple">
          Choose Your Package
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the perfect party package for your celebration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {PACKAGES.map((pkg) => {
          const isSelected = bookingData.package === pkg.name;
          const price = getPackagePrice(pkg.name);

          return (
            <div
              key={pkg.name}
              onClick={() => handleSelect(pkg.name)}
              className={`cursor-pointer transition-all ${
                isSelected ? "ring-4 ring-primary rounded-lg glow-purple" : ""
              }`}
            >
              <PackageCard
                name={pkg.name}
                description={pkg.description}
                price={`$${price}`}
                features={pkg.features}
                glowColor={pkg.glowColor}
                featured={pkg.featured}
                imageUrl=""
              />
            </div>
          );
        })}
      </div>

      {bookingData.package && (
        <div className="bg-card border border-primary rounded-lg p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Selected Package:</span>
            <span className="text-2xl font-bold text-primary">
              ${bookingData.pricing.subtotal}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={!bookingData.package}
          size="lg"
          className="gradient-purple-pink glow-purple text-white font-semibold px-12"
        >
          Continue to Add-Ons →
        </Button>
      </div>

      {/* Extra Hours Confirmation Modal */}
      {bookingData.timeBlock && (() => {
        const duration = calculateDuration(bookingData.timeBlock);
        const extraHours = duration > 3 ? Math.ceil(duration - 3) : 0;
        const extraHoursCost = calculateExtraHoursCost(extraHours);

        return (
          <ExtraHoursModal
            isOpen={showExtraHoursModal}
            totalHours={Math.ceil(duration)}
            extraHours={extraHours}
            extraHoursCost={extraHoursCost}
            onContinue={handleConfirmExtraHours}
            onChangeTime={handleChangePackage}
            changeButtonText="Choose Different Package"
          />
        );
      })()}
    </div>
  );
}
