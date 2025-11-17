"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Users } from "lucide-react";

interface ProductOption {
  name: string;
  description: string;
  capacity: string;
  imageUrl: string;
  glowColor: "purple" | "pink" | "teal";
}

const products: ProductOption[] = [
  {
    name: "Dance Dome",
    description: "Classic igloo-style inflatable nightclub perfect for any celebration",
    capacity: "10-15 guests",
    dimensions: "16x16",
    imageUrl: "/igloo_shape.jpg",
    glowColor: "pink",
  },
  {
    name: "Light Haus",
    description: "Modern cube design with maximum space and style",
    capacity: "20-30 guests",
    dimesnions: "20x20x12",
    imageUrl: "/box_shape.JPG",
    glowColor: "purple",
  },
  {
    name: "Club Noir",
    description: "Premium house-style venue for the ultimate party experience",
    capacity: "20-30 guests",
    dimensions: "23x16x12",
    imageUrl: "/house_shape.jpg",
    glowColor: "teal",
  },
];

interface ProductSelectorProps {
  selectedProduct: string | null;
  onProductSelect: (productName: string) => void;
}

export function ProductSelector({ selectedProduct, onProductSelect }: ProductSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => {
        const isSelected = selectedProduct === product.name;
        
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
            onClick={() => onProductSelect(product.name)}
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
                loading="lazy"
                quality={85}
              />
            </div>
            <div className="p-6 text-center">
              <h3 className={`text-2xl font-bold mb-2 ${isSelected ? textGlowClass : "text-foreground"}`}>
                {product.name}
              </h3>
              <p className="text-muted-foreground mb-3">{product.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Capacity: {product.capacity}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
