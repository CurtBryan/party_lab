"use client";

import { useState, useRef } from "react";
import { ProductSelector } from "./product-selector";
import { PackageCard } from "./package-card";
// import { AddOns } from "./add-ons";

export function PackagesSection() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const experienceRef = useRef<HTMLDivElement>(null);

  const handleProductSelect = (productName: string) => {
    setSelectedProduct(productName);
    
    setTimeout(() => {
      experienceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const getPricing = (baseDanceDome: string, baseOther: string) => {
    if (!selectedProduct) {
      return `$${baseDanceDome} - $${baseOther}`;
    }
    
    if (selectedProduct === "Dance Dome") {
      return (
        <>
          <span className="text-primary">${baseDanceDome}</span>
          <span className="text-muted-foreground/50"> - ${baseOther}</span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-muted-foreground/50">${baseDanceDome} - </span>
          <span className="text-primary">${baseOther}</span>
        </>
      );
    }
  };

  return (
    <section id="packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-pink">
            Choose Your Package
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From intimate gatherings to epic celebrations, we have the perfect inflatable nightclub package for your event.
          </p>
        </div>

        {/* Step 1: Choose Your Product */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3 text-glow-purple">
              Step 1: Choose Your Product
            </h3>
            <p className="text-muted-foreground">
              Select your inflatable nightclub venue style
            </p>
          </div>
          <ProductSelector 
            selectedProduct={selectedProduct} 
            onProductSelect={handleProductSelect} 
          />
        </div>

        {/* Step 2: Choose Your Party Experience */}
        <div className="mb-20" ref={experienceRef}>
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3 text-glow-pink">
              Step 2: Choose Your Party Experience
            </h3>
            <p className="text-muted-foreground">
              Pick the experience tier that fits your celebration
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PackageCard
              name="Party Starter"
              description="Perfect for birthdays & small gatherings"
              price={getPricing("375", "400")}
              features={[
                "Color-Changing LED Lighting",
                "Bluetooth Speaker Sound System",
                "3-Hour Rental",
                "Setup & Teardown Included",
              ]}
              glowColor="purple"
            />

            <PackageCard
              name="Glow Getter"
              description="A VIP vibe with built-in extras"
              price={getPricing("450", "500")}
              features={[
                "Everything in Party Starter",
                "Red Ropes & Carpet",
                "Glow Up Kit (20) Included",
                "Wireless Microphones Included",
                "Curated Playlist + Themed Video Projector",
              ]}
              glowColor="pink"
              featured={true}
            />

            <PackageCard
              name="All-Star VIP"
              description="Go all out! This package includes every party add-on and extra time for the ultimate celebration experience."
              price={getPricing("525", "600")}
              features={[
                "Everything in Glow Getter",
                "Premium LED Lighting & Sound System",
                "Additional Wireless Microphone",
                "Capacity: 20-30 guests",
              ]}
              glowColor="teal"
            />
          </div>
        </div>

        {/* Step 3: Add-Ons */}
        {/* <div className="mb-12">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3 text-glow-teal">
              Step 3: Customize with Add-Ons
            </h3>
            <p className="text-muted-foreground">
              Enhance your party with these optional extras
            </p>
          </div>
          <AddOns />
        </div> */}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2">
            All packages include setup and teardown. Turn any space into a nightclub in 30 minutes!
          </p>
          <p className="text-sm text-muted-foreground">
            Serving the Phoenix metro area and throughout Arizona.
          </p>
        </div>
      </div>
    </section>
  );
}
