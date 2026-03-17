"use client";

import { CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews: { name: string; eventType: string; text: string }[] = [
  {
    name: "Samantha B.",
    eventType: "Birthday Party",
    text: "We rented the blow up nightclub for our 7-year-old's birthday party, and it was a hit! The setup and takedown were smooth and efficient. The kids were beyond excited — the red carpet entrance made them feel like VIPs!",
  },
  {
    name: "Kyrene de la Mariposa PTO",
    eventType: "School/PTO Event",
    text: "We highly recommend Party Lab AZ for school and PTO events. We have had them set up for our last 3 events and the kids LOVE it! They make it easy by doing all the setup and breakdown.",
  },
  {
    name: "Brittany W.",
    eventType: "Neighborhood Festival",
    text: "We rented the dance dome for our Winter themed neighborhood festival and both the kids and adults had a blast! Booking was seamless and communication was top notch. Highly recommend!",
  },
];

export function ReviewsSection() {
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

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-5 sm:p-6 hover:border-primary/50 transition-all"
            >
              {/* Verified Badge */}
              <div className="flex items-center gap-2 mb-3 text-green-500">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Verified Customer</span>
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base text-foreground mb-4 leading-relaxed">
                "{review.text}"
              </p>

              {/* Reviewer Info */}
              <div className="border-t border-border pt-3">
                <p className="font-semibold text-sm sm:text-base text-foreground">{review.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{review.eventType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
