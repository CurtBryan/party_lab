"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface EmailFormProps {
  onBookNowClick?: () => void;
}

export function EmailForm({ onBookNowClick }: EmailFormProps = {}) {
  return (
    <section id="request-info" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-card border-2 border-primary rounded-2xl p-12 glow-purple animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow-purple">
            Ready to Party?
          </h2>
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
    </section>
  );
}
