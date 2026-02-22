"use client";

import { CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Add real customer reviews here as you collect them
const reviews: { name: string; eventType: string; rating: number; text: string }[] = [
  {
    name: "Samantha B.",
    eventType: "Birthday Party",
    rating: 5,
    text: "We rented the blow up nightclub for our 7-year-old's birthday party, and it was a hit! From start to finish, they were easy to schedule with and very quick to communicate. The setup and takedown were smooth and efficient, and everything was handled professionally. The kids were beyond excited — the red carpet entrance made them feel like VIPs, and they loved the disco ball. I would absolutely recommend Partylabaz for any age range!",
  },
  {
    name: "Kyrene de la Mariposa PTO",
    eventType: "School/PTO Event",
    rating: 5,
    text: "We highly recommend Party Lab AZ for school and PTO events. We have had them set up various sizes for our last 3 events and the kids LOVE it! They make it easy by doing all of the set up and breakdown, and it adds so much to the fun atmosphere of our events. Kids have a great time dancing inside to all their favorite songs. We'll definitely use them for our PTO events again!",
  },
  {
    name: "Brittany W.",
    eventType: "Neighborhood Festival",
    rating: 5,
    text: "We rented the dance dome for our Winter themed neighborhood festival and both the kids and adults had a blast! The red carpet entrance and ropes are such a fun way to elevate the \"VIP\" experience. Booking was seamless and communication was top notch from start to finish. Excellent experience all around and such a fun and unique addition to our event. Highly recommend Partylabaz!",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow-pink">
            What People Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Don't just take our word for it — hear from families and party-goers who've experienced the Partylab magic!
          </p>
          <a
            href="https://www.facebook.com/61579352249971/reviews"
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

        {/* Reviews Grid - Shows when reviews exist */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:glow-purple"
              >
                {/* Verified Badge */}
                <div className="flex items-center gap-2 mb-4 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Verified Customer</span>
                </div>

                {/* Review Text */}
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.text}"
                </p>

                {/* Reviewer Info */}
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.eventType}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
