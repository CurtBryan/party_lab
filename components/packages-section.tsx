"use client";

import { useState, useRef } from "react";
import { ProductSelector } from "./product-selector";
import { PackageCard } from "./package-card";

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
      </div>
    </section>
  )
}