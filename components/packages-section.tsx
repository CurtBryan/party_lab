"use client";

import { useState } from "react";
import { ProductSelector } from "./product-selector";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";
import { ADD_ONS, PACKAGES } from "@/lib/constants";
import type { InitialBookingData, ProductType, PackageType } from "@/types/booking";

interface PackagesSectionProps {
  onBookNowClick?: (initialData?: InitialBookingData) => void;
}

type BuildMode = "package" | "custom";

export function PackagesSection({ onBookNowClick }: PackagesSectionProps = {}) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [buildMode, setBuildMode] = useState<BuildMode>("package");
  const [selectedPackage, setSelectedPackage] = useState<string>("Party Starter");
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [showAllAddOns, setShowAllAddOns] = useState(false);

  const getBasePrice = () => {
    if (selectedProduct === "Dance Dome") return 450;
    return 500;
  };

  const getPackageUpgrade = () => {
    const pkg = PACKAGES.find(p => p.name === selectedPackage);
    return pkg?.price || 0;
  };

  const getCustomTotal = () => {
    let total = getBasePrice();
    selectedAddOns.forEach(addOnId => {
      const addOn = ADD_ONS.find(a => a.id === addOnId);
      if (addOn) total += addOn.price;
    });
    return total;
  };

  const getPackageTotal = () => {
    return getBasePrice() + getPackageUpgrade();
  };

  const getCurrentPackage = () => {
    return PACKAGES.find(p => p.name === selectedPackage);
  };

  const toggleAddOn = (id: string) => {
    const newSet = new Set(selectedAddOns);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedAddOns(newSet);
  };

  const primaryAddOns = ADD_ONS.slice(0, 4);
  const additionalAddOns = ADD_ONS.slice(4);

  return (
    <section id="packages" className="pt-8 sm:pt-10 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header - one step down from hero */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-glow-pink">
            Build Your Party
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Choose your venue, then customize with add-ons or pick a package to save
          </p>
        </div>

        {/* Step 1: Choose Venue */}
        <div className="mb-10">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center text-glow-purple">
            Step 1: Choose Your Venue
          </h3>
          <ProductSelector
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            compact={true}
          />
        </div>

        {/* Step 2: Build Mode */}
        {selectedProduct && (
          <div className="animate-fade-in">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center text-glow-purple">
              Step 2: Customize Your Experience
            </h3>

            {/* Toggle Buttons */}
            <div className="flex justify-center gap-3 mb-6">
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
              <div className="space-y-5 animate-fade-in">
                {/* Package Options */}
                <div className="grid grid-cols-3 gap-3">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.name}
                      onClick={() => setSelectedPackage(pkg.name)}
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
                        {pkg.price === 0 ? "Base" : `+$${pkg.price}`}
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
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {primaryAddOns.map((addOn) => (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        selectedAddOns.has(addOn.id)
                          ? "border-primary bg-primary/10 glow-purple"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-semibold leading-tight">{addOn.name}</span>
                        {selectedAddOns.has(addOn.id) && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-primary">${addOn.price}</div>
                    </button>
                  ))}
                </div>

                {additionalAddOns.length > 0 && (
                  <>
                    <button
                      onClick={() => setShowAllAddOns(!showAllAddOns)}
                      className="flex items-center justify-center gap-1.5 w-full text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      {showAllAddOns ? "Show less" : `+${additionalAddOns.length} more options`}
                      {showAllAddOns ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showAllAddOns && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 animate-fade-in">
                        {additionalAddOns.map((addOn) => (
                          <button
                            key={addOn.id}
                            onClick={() => toggleAddOn(addOn.id)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                              selectedAddOns.has(addOn.id)
                                ? "border-primary bg-primary/10 glow-purple"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm font-semibold leading-tight">{addOn.name}</span>
                              {selectedAddOns.has(addOn.id) && (
                                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-primary">${addOn.price}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Base includes LED lighting, Bluetooth speakers, 3-hour rental, setup & teardown
                </p>
              </div>
            )}
          </div>
        )}

        {/* Price Summary & Book Button */}
        {selectedProduct && (
          <div className="mt-8 sticky bottom-4 z-10 animate-fade-in">
            <div className="bg-card border-2 border-primary rounded-xl p-4 sm:p-5 shadow-xl glow-purple">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-glow-pink">
                      ${buildMode === "package" ? getPackageTotal() : getCustomTotal()}
                    </span>
                    <span className="text-sm sm:text-base text-muted-foreground">
                      {selectedProduct}
                      {buildMode === "package" && selectedPackage !== "Party Starter" && ` + ${selectedPackage}`}
                    </span>
                  </div>
                  {buildMode === "package" && getCurrentPackage()?.savings && (
                    <span className="text-xs sm:text-sm text-green-500 font-semibold">
                      You save ${getCurrentPackage()?.savings}!
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => {
                    if (onBookNowClick && selectedProduct) {
                      const initialData: InitialBookingData = {
                        product: selectedProduct as ProductType,
                        buildMode,
                        package: buildMode === "package" ? selectedPackage as PackageType : null,
                        selectedAddOns: buildMode === "custom" ? Array.from(selectedAddOns) : [],
                        totalPrice: buildMode === "package" ? getPackageTotal() : getCustomTotal(),
                      };
                      onBookNowClick(initialData);
                    }
                  }}
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gradient-purple-pink hover:opacity-90 hover:scale-105 transition-all glow-purple text-white font-semibold shadow-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Prompt to select product */}
        {!selectedProduct && (
          <p className="text-center text-sm sm:text-base text-muted-foreground py-6">
            Select a venue above to see pricing and customize your party
          </p>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            All packages include setup & teardown. Serving Phoenix metro & all of Arizona.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            LED lights have limited visibility in daylight.
          </p>
        </div>
      </div>
    </section>
  );
}
