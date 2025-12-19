"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

interface PackageCardProps {
  name: string;
  description: string;
  price: string | React.ReactNode;
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
        featured ? `border-primary pt-12` : "border-border hover:border-primary"
      }`}
    >
      {featured && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className={`${gradientClass} px-4 py-1 rounded-full text-sm font-semibold text-white shadow-lg`}>
            Most Popular
          </span>
        </div>
      )}

      {imageUrl && (
        <div className={`mb-6 -mx-8 ${featured ? '-mt-12' : '-mt-8'}`}>
          <div className="relative h-64 overflow-hidden bg-black">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={85}
            />
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-foreground">
          {name}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="text-4xl font-bold text-primary mb-2">{price}</div>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
