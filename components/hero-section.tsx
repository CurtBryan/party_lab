"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Instagram, MessageCircle } from "lucide-react";
import Image from "next/image";
import { TalkToUsModal } from "@/components/talk-to-us-modal";

interface HeroSectionProps {
  onBookNowClick?: () => void;
}

export function HeroSection({ onBookNowClick }: HeroSectionProps = {}) {
  const [isTalkToUsOpen, setIsTalkToUsOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Logo - Top Left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Image
          src="/logo-small.png"
          alt="The Partylab"
          width={128}
          height={128}
          className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32"
          priority
        />
      </div>

      {/* Social Links - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex gap-2 sm:gap-3">
        <a
          href="https://instagram.com/partylabaz"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:glow-purple transition-all"
          aria-label="Follow us on Instagram"
        >
          <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
        <a
          href="https://www.facebook.com/people/Partylabaz/61579352249971"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-secondary hover:border-secondary hover:glow-pink transition-all"
          aria-label="Follow us on Facebook"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </div>

      {/* Background Image - Very Visible */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/hero.JPG')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background z-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center pt-28 pb-20 sm:py-20 px-4">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-primary rounded-full px-4 py-2 sm:px-6 mb-8 glow-purple">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-white">Arizona's Premier Inflatable Nightclub for Kids</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            Bring the{" "}
            <span className="text-glow-purple bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Nightclub
            </span>
            <br />
            to Your Backyard
          </h1>

          {/* Subheadline */}
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl text-white">
              Turn any space into a nightclub! Inflatable nightclubs with LED lighting, visual dance videos on a projector,
              and curated playlists—made for birthdays, teen parties, and unforgettable celebrations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 justify-center items-center">
            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-2xl px-12 py-8 gradient-purple-pink hover:opacity-90 hover:scale-105 transition-all glow-purple text-white font-bold group shadow-2xl animate-pulse-glow"
                onClick={onBookNowClick}
              >
                <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-10 py-8 border-2 border-primary bg-primary/10 backdrop-blur-sm text-white hover:bg-primary/20 hover:scale-105 transition-all group glow-purple"
                onClick={() => setIsTalkToUsOpen(true)}
              >
                <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Talk to Us First
              </Button>
            </div>

            {/* Secondary Button */}
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all group"
              onClick={() => {
                document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Packages
            </Button>
          </div>

          {/* Stats or Social Proof */}
          <div className="mt-16 flex flex-col gap-4 max-w-md mx-auto">
           <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold text-accent mb-2">AZ</div>
              <div className="text-sm text-white">Statewide Service</div>
            </div>
            <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-2">✅ Fully Insured</div>
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

      {/* Talk to Us Modal */}
      <TalkToUsModal
        isOpen={isTalkToUsOpen}
        onClose={() => setIsTalkToUsOpen(false)}
      />
    </section>
  );
}
