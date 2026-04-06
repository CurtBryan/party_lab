"use client";

import { useState } from "react";
import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { ADD_ONS, PACKAGES } from "@/lib/constants";
import type { PackageType, AddOns } from "@/types/booking";

type BuildMode = "package" | "custom";

export function Screen2Experience() {
  const { bookingData, updatePackage, updateAddOns, nextStep } = useBooking();

  const [buildMode, setBuildMode] = useState<BuildMode>("custom");
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(
    bookingData.package || "Party Starter"
  );

  // Get product-specific base price
  const getBasePrice = (): number => {
    return bookingData.product === "Dance Dome" ? 250 : 300;
  };

  // Get package price (base + upgrade)
  const getPackagePrice = (packageName: PackageType): number => {
    const basePrice = getBasePrice();
    const pkg = PACKAGES.find(p => p.name === packageName);
    return basePrice + (pkg?.price || 0);
  };

  // Calculate custom total from add-ons
  const getCustomTotal = (): number => {
    let total = getBasePrice();
    ADD_ONS.forEach(addOn => {
      if (bookingData.addOns[addOn.id as keyof AddOns]) {
        total += addOn.price;
      }
    });
    return total;
  };

  const getCurrentPackage = () => {
    return PACKAGES.find(p => p.name === selectedPackage);
  };

  const handlePackageSelect = (pkgName: PackageType) => {
    setSelectedPackage(pkgName);
  };

  const toggleAddOn = (addonId: string) => {
    updateAddOns({
      ...bookingData.addOns,
      [addonId]: !bookingData.addOns[addonId as keyof AddOns],
    });
  };

  const handleContinue = () => {
    if (buildMode === "package") {
      const price = getPackagePrice(selectedPackage);
      updatePackage(selectedPackage, price);
    } else {
      // For custom mode, set Party Starter as base and use add-ons
      const price = getCustomTotal();
      updatePackage("Party Starter", price);
    }
    nextStep();
  };


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-glow-pink">
          Customize Your Experience
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Choose a package to save or build your own with add-ons
        </p>

        {/* Show selected venue */}
        {bookingData.product && (
          <p className="text-sm text-muted-foreground mt-2">
            Venue: <span className="text-primary font-semibold">{bookingData.product}</span>
          </p>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setBuildMode("package")}
          className={`px-5 py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all ${
            buildMode === "package"
              ? "bg-primary text-primary-foreground glow-purple"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Choose Package <span className="text-green-400">(Save $)</span>
        </button>
        <button
          onClick={() => setBuildMode("custom")}
          className={`px-5 py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all ${
            buildMode === "custom"
              ? "bg-primary text-primary-foreground glow-purple"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Build Your Own
        </button>
      </div>

      {/* Package Selection Mode */}
      {buildMode === "package" && (
        <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
          {/* Package Options */}
          <div className="grid grid-cols-3 gap-3">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.name}
                onClick={() => handlePackageSelect(pkg.name as PackageType)}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                  selectedPackage === pkg.name
                    ? "border-primary bg-primary/10 glow-purple"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-sm sm:text-base font-bold">{pkg.name}</span>
                  {selectedPackage === pkg.name && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="text-lg sm:text-xl font-bold text-primary">
                  ${getPackagePrice(pkg.name as PackageType)}
                </div>
                {pkg.savings && (
                  <div className="text-xs sm:text-sm text-green-500 font-semibold mt-0.5">
                    Save ${pkg.savings}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selected Package Details */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
            <p className="text-sm sm:text-base font-semibold mb-2">What's Included:</p>
            <div className="flex flex-wrap gap-1.5">
              {getCurrentPackage()?.features.map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs sm:text-sm bg-muted px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3 text-green-500" />
                  {feature}
                </span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              All packages include LED lighting, Bluetooth speakers, 3-hour rental, setup & teardown
            </p>
          </div>
        </div>
      )}

      {/* Build Your Own Mode */}
      {buildMode === "custom" && (
        <div className="space-y-5 animate-fade-in max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {ADD_ONS.map((addOn) => {
              const isSelected = bookingData.addOns[addOn.id as keyof AddOns];
              return (
                <button
                  key={addOn.id}
                  onClick={() => toggleAddOn(addOn.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/10 glow-purple"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-semibold leading-tight">{addOn.name}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-primary">${addOn.price}</div>
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Base includes LED lighting, Bluetooth speakers, 3-hour rental, setup & teardown
          </p>
        </div>
      )}

      {/* Price Summary & Continue Button */}
      <div className="max-w-md mx-auto">
        <div className="bg-card border-2 border-primary rounded-xl p-4 sm:p-5 glow-purple">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-glow-pink">
                  ${buildMode === "package" ? getPackagePrice(selectedPackage) : getCustomTotal()}
                </span>
              </div>
              {buildMode === "package" && getCurrentPackage()?.savings && (
                <span className="text-xs sm:text-sm text-green-500 font-semibold">
                  You save ${getCurrentPackage()?.savings}!
                </span>
              )}
            </div>
            <Button
              onClick={handleContinue}
              size="lg"
              className="text-base sm:text-lg px-6 py-5 gradient-purple-pink hover:opacity-90 hover:scale-105 transition-all glow-purple text-white font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
