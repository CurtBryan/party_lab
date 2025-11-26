"use client";

import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Users, Maximize2 } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import type { ProductType } from "@/types/booking";

export function Screen1Product() {
  const { bookingData, updateProduct, nextStep } = useBooking();

  const handleSelect = (productName: ProductType) => {
    updateProduct(productName);
  };

  const handleContinue = () => {
    if (bookingData.product) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-glow-purple">
          Choose Your Venue
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the perfect inflatable nightclub for your event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => {
          const isSelected = bookingData.product === product.name;

          const glowClass = {
            purple: "glow-purple",
            pink: "glow-pink",
            teal: "glow-teal",
          }[product.glowColor];

          const textGlowClass = {
            purple: "text-glow-purple",
            pink: "text-glow-pink",
            teal: "text-glow-teal",
          }[product.glowColor];

          return (
            <Card
              key={product.name}
              onClick={() => handleSelect(product.name)}
              className={`relative overflow-hidden bg-card border-2 transition-all hover:scale-105 group cursor-pointer ${
                isSelected ? `border-primary ${glowClass}` : "border-border hover:border-primary"
              }`}
            >
              <div className="relative h-72 overflow-hidden bg-black">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className={`text-2xl font-bold mb-2 ${isSelected ? textGlowClass : "text-foreground"}`}>
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-3">{product.description}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {product.capacity}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Maximize2 className="w-4 h-4" />
                    <span>Size: {product.dimensions}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={!bookingData.product}
          size="lg"
          className="gradient-purple-pink glow-purple text-white font-semibold px-12"
        >
          Continue to Date & Time →
        </Button>
      </div>
    </div>
  );
}
