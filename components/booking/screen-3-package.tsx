"use client";

import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/package-card";
import { PACKAGES } from "@/lib/constants";
import type { PackageType } from "@/types/booking";

export function Screen3Package() {
  const { bookingData, updatePackage, nextStep } = useBooking();

  // Check if booking is during daylight hours (before 5 PM)
  const isDaylightBooking = () => {
    if (!bookingData.timeBlock) return false;
    const startTime = bookingData.timeBlock.split("-")[0];
    const hour = parseInt(startTime.split(":")[0]);
    return hour < 17; // Before 5:00 PM
  };

  // Get product-specific pricing
  const getPackagePrice = (packageName: PackageType): number => {
    const isDanceDome = bookingData.product === "Dance Dome";

    switch (packageName) {
      case "Party Starter":
        return isDanceDome ? 250 : 300;
      case "Daylight Dance":
        return isDanceDome ? 275 : 350;
      case "Glow Getter":
        return isDanceDome ? 325 : 400;
      case "All-Star VIP":
        return isDanceDome ? 400 : 500;
      default:
        return 300;
    }
  };

  const handleSelect = (packageName: PackageType) => {
    const price = getPackagePrice(packageName);
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

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-4">
        {PACKAGES.map((pkg) => {
          const isSelected = bookingData.package === pkg.name;
          const price = getPackagePrice(pkg.name);
          const isRecommendedForDaylight = isDaylightBooking() && pkg.name === "Daylight Dance";

          return (
            <div
              key={pkg.name}
              onClick={() => handleSelect(pkg.name)}
              className={`cursor-pointer transition-all relative ${
                isSelected ? "ring-4 ring-primary rounded-lg glow-purple" : ""
              } ${
                isRecommendedForDaylight && !isSelected ? "ring-2 ring-amber-500/50 rounded-lg" : ""
              }`}
            >
              {isRecommendedForDaylight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                  ☀️ Recommended for Daytime
                </div>
              )}
              <PackageCard
                name={pkg.name}
                description={pkg.description}
                price={`$${price}`}
                features={pkg.features}
                glowColor={pkg.glowColor}
                featured={false}
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
