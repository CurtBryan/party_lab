"use client";

import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/package-card";
import { PACKAGES } from "@/lib/constants";
import type { PackageType } from "@/types/booking";

export function Screen3Package() {
  const { bookingData, updatePackage, nextStep } = useBooking();

  const handleSelect = (packageName: PackageType, price: number) => {
    updatePackage(packageName, price);
  };

  const handleContinue = () => {
    if (bookingData.package) {
      nextStep();
    }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => {
          const isSelected = bookingData.package === pkg.name;

          return (
            <div
              key={pkg.name}
              onClick={() => handleSelect(pkg.name, pkg.price)}
              className={`cursor-pointer transition-all ${
                isSelected ? "ring-4 ring-primary rounded-lg glow-purple" : ""
              }`}
            >
              <PackageCard
                name={pkg.name}
                description={pkg.description}
                price={`$${pkg.price}`}
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
    </div>
  );
}
