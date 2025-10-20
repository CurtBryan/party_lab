"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PackageCardProps {
  name: string;
  description: string;
  price: string;
  features: string[];
  glowColor?: "purple" | "pink" | "teal";
  featured?: boolean;
  imageUrl?: string;
}

export function PackageCard({
  name,
  description,
  price,
  features,
  glowColor = "purple",
  featured = false,
  imageUrl,
}: PackageCardProps) {
  const glowClass = {
    purple: "glow-purple",
    pink: "glow-pink",
    teal: "glow-teal",
  }[glowColor];

  const textGlowClass = {
    purple: "text-glow-purple",
    pink: "text-glow-pink",
    teal: "text-glow-teal",
  }[glowColor];

  const gradientClass = {
    purple: "gradient-purple-pink",
    pink: "gradient-pink-teal",
    teal: "gradient-purple-teal",
  }[glowColor];

  return (
    <Card
      className={`relative p-8 bg-card border-2 transition-all hover:scale-105 overflow-hidden ${
        featured ? `border-primary ${glowClass}` : "border-border hover:border-primary"
      }`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className={`${gradientClass} px-4 py-1 rounded-full text-sm font-semibold text-white`}>
            Most Popular
          </span>
        </div>
      )}

      {imageUrl && (
        <div className="mb-6 -mx-8 -mt-8">
          <div className="relative h-48 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className={`text-3xl font-bold mb-2 ${featured ? textGlowClass : "text-foreground"}`}>
          {name}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="text-4xl font-bold text-primary mb-2">{price}</div>
      </div>

      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        className={`w-full ${gradientClass} hover:opacity-90 transition-all text-white font-semibold`}
        onClick={() => {
          document.getElementById("request-info")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Request Info
      </Button>
    </Card>
  );
}
