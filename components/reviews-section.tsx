"use client";

import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-8 h-8 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow-pink">
          Love Your Experience?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          We'd love to hear about your party! Your review helps other families discover the Partylab magic.
        </p>

        <a
          href="https://www.facebook.com/people/Partylabaz/61579352249971/reviews"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="gradient-purple-pink glow-pink text-white font-semibold px-8"
          >
            Leave a Review on Facebook
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>
    </section>
  );
}
