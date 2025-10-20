"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmailForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual email service integration)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", eventType: "" });
      setIsSubmitted(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="request-info" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-purple">
            Get Party Info
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill out the form below and we'll send you all the details about bringing the nightclub experience to your event!
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-card border border-primary rounded-lg p-8 text-center glow-purple animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2 text-primary">
              Thanks for your interest!
            </h3>
            <p className="text-muted-foreground">
              We'll send you all the party details shortly. Get ready to turn your event into an unforgettable nightclub experience!
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-lg p-8 space-y-6 animate-slide-up"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-input border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-input border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="bg-input border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-foreground">
                Event Type
              </Label>
              <Input
                id="eventType"
                name="eventType"
                type="text"
                placeholder="Birthday, Graduation, Sweet 16, etc."
                value={formData.eventType}
                onChange={handleChange}
                className="bg-input border-border focus:border-primary transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-lg py-6 gradient-purple-pink hover:opacity-90 transition-all glow-purple"
            >
              {isSubmitting ? "Sending..." : "Get Party Info"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
