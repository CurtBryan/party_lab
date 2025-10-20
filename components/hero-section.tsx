"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Calendar } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 gradient-neon-radial opacity-30" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center py-20">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card border border-primary rounded-full px-6 py-2 mb-8 glow-purple">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Arizona's Premier Inflatable Nightclub</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Bring the{" "}
            <span className="text-glow-purple bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Nightclub
            </span>
            <br />
            to Your Backyard
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Turn any space into a nightclub in 30 minutes! Inflatable nightclubs with LED lighting, premium sound,
            and curated playlists. Perfect for birthdays, teen parties, and unforgettable celebrations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 gradient-purple-pink hover:opacity-90 transition-all glow-purple text-white font-semibold group"
              onClick={() => {
                document.getElementById("request-info")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Request Info
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10 transition-all group"
              onClick={() => {
                document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Packages
            </Button>
          </div>

          {/* Stats or Social Proof */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Epic Parties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">5★</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">AZ</div>
              <div className="text-sm text-muted-foreground">Statewide Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
