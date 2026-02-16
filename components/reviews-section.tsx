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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — hear from families and party-goers who've experienced the Partylab magic!
          </p>
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

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Had a great experience? We'd love to hear about it!
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
              Leave a Review
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
