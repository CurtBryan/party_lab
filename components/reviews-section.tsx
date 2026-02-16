"use client";

import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    name: "Maria S.",
    eventType: "Birthday Party",
    rating: 5,
    text: "The kids had an absolute blast! The Dance Dome was the highlight of my daughter's 10th birthday. Setup was quick and the team was so professional.",
  },
  {
    name: "Jason T.",
    eventType: "Sweet 16",
    rating: 5,
    text: "My daughter's Sweet 16 was unforgettable thanks to Partylab. The lights, music, and vibe were perfect. All her friends are still talking about it!",
  },
  {
    name: "Amanda R.",
    eventType: "School Event",
    rating: 5,
    text: "We hired Partylab for our school's end-of-year celebration. The Club Noir was a huge hit with the students. Will definitely book again!",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow-pink">
            What Parents Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — hear from families who've experienced the Partylab magic!
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:glow-purple"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
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

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Had a great experience? We'd love to hear about it!
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
              Leave a Review
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
