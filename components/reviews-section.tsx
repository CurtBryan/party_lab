"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews: { name: string; eventType: string; text: string; source: "google" | "facebook" }[] = [
  {
    name: "Samantha B.",
    eventType: "Birthday Party",
    text: "We rented the blow up nightclub for our 7-year-old's birthday party, and it was a hit! The setup and takedown were smooth and efficient. The kids were beyond excited — the red carpet entrance made them feel like VIPs!",
    source: "facebook",
  },
  {
    name: "Kyrene de la Mariposa PTO",
    eventType: "School/PTO Event",
    text: "We highly recommend Party Lab AZ for school and PTO events. We have had them set up for our last 3 events and the kids LOVE it! They make it easy by doing all the setup and breakdown.",
    source: "facebook",
  },
  {
    name: "Brittany W.",
    eventType: "Neighborhood Festival",
    text: "We rented the dance dome for our Winter themed neighborhood festival and both the kids and adults had a blast! Booking was seamless and communication was top notch. Highly recommend!",
    source: "facebook",
  },
  {
    name: "Happy Customer",
    eventType: "Birthday Party",
    text: "Amazing experience! The kids had so much fun and the setup was perfect. Will definitely book again!",
    source: "google",
  },
];

// Source icons
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextReview = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, []);

  const prevReview = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextReview]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-glow-pink">
            What People Are Saying
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
            Don't just take our word for it — hear from families who've experienced the Partylab magic!
          </p>
          <a
            href="https://g.page/r/CYnYUmoj222SEAI/review"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="text-sm sm:text-base gradient-purple-pink glow-pink text-white font-semibold px-6 sm:px-8"
            >
              Leave a Review on Google
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>

        {/* Reviews Carousel */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 bg-card border border-border rounded-full p-2 hover:border-primary/50 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 bg-card border border-border rounded-full p-2 hover:border-primary/50 transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Review Card */}
          <div className="overflow-hidden px-8 sm:px-12">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-2xl mx-auto">
                    {/* Source Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">Verified Customer</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {review.source === "google" ? (
                          <GoogleIcon className="w-5 h-5" />
                        ) : (
                          <FacebookIcon className="w-5 h-5" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">{review.source}</span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-base sm:text-lg text-foreground mb-6 leading-relaxed text-center">
                      "{review.text}"
                    </p>

                    {/* Reviewer Info */}
                    <div className="border-t border-border pt-4 text-center">
                      <p className="font-semibold text-base sm:text-lg text-foreground">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.eventType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-6"
                    : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
