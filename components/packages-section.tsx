"use client";

import { useState, useRef } from "react";
import { ProductSelector } from "./product-selector";
import { PackageCard } from "./package-card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
// import { AddOns } from "./add-ons";

interface PackagesSectionProps {
  onBookNowClick?: () => void;
}

export function PackagesSection({ onBookNowClick }: PackagesSectionProps = {}) {
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

    // Dance Dome uses bottom of range, Light Haus & Club Noir use top of range
    if (selectedProduct === "Dance Dome") {
      return `$${baseDanceDome}`;
    } else {
      return `$${baseOther}`;
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

        {/* Choose Your Product */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3 text-glow-purple">
              Choose Your Product
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
              Choose Your Party Experience
            </h3>
            <p className="text-muted-foreground">
              Pick the experience tier that fits your celebration
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PackageCard
              name="Party Starter"
              description="Perfect for birthdays & small gatherings"
              price={getPricing("250", "300")}
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
              price={getPricing("325", "400")}
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
              description="Big wins deserve big celebrations! The All-Star VIP Package brings extra time, nonstop music, and the full nightclub experience — perfect for schools, teams, and community events ready to party all night!"
              price={getPricing("400", "500")}
              features={[
                "Everything in Glow Getter",
                "Extended hours included",
                "Overnight Parties",
              ]}
              glowColor="teal"
            />
          </div>

          {/* Book Now Section */}
          <div className="mt-16 max-w-4xl mx-auto text-center">
            <div className="bg-card border-2 border-primary rounded-2xl p-12 glow-purple animate-fade-in">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-glow-purple">
                Ready to Party?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Book your inflatable nightclub experience now and create unforgettable memories!
              </p>
              <Button
                size="lg"
                onClick={onBookNowClick}
                className="text-2xl px-12 py-8 gradient-purple-pink hover:opacity-90 hover:scale-105 transition-all glow-purple text-white font-bold shadow-2xl animate-pulse-glow"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Book Now
              </Button>
            </div>
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
            All packages include setup and teardown.
          </p>
          <p className="text-sm text-muted-foreground">
            Serving the Phoenix metro area and throughout Arizona.
          </p>
        </div>
      </div>
    </section>
  );
}
