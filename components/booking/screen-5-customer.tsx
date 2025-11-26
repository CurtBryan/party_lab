"use client";

import { useState } from "react";
import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { EVENT_TYPES } from "@/lib/constants";
import type { CustomerInfo } from "@/types/booking";

export function Screen5Customer() {
  const { bookingData, updateCustomer, nextStep } = useBooking();

  const [formData, setFormData] = useState<CustomerInfo>({
    name: bookingData.customer?.name || "",
    email: bookingData.customer?.email || "",
    phone: bookingData.customer?.phone || "",
    address: bookingData.customer?.address || "",
    eventType: bookingData.customer?.eventType || "",
    specialRequests: bookingData.customer?.specialRequests || "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format (use: 123-456-7890)";
    }
    if (!formData.address.trim()) newErrors.address = "Event address is required";
    if (!formData.eventType) newErrors.eventType = "Please select an event type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    if (validateForm() && agreedToTerms) {
      updateCustomer(formData);
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-glow-purple">
          Your Information
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell us about your event so we can prepare everything perfectly
        </p>
      </div>

      <Card className="max-w-2xl mx-auto p-8">
        <form className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="602-555-1234"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Event Address *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main St, Phoenix, AZ 85001"
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive mt-1">{errors.address}</p>
            )}
          </div>

          {/* Event Type */}
          <div>
            <Label htmlFor="eventType">Event Type *</Label>
            <select
              id="eventType"
              value={formData.eventType}
              onChange={(e) => handleChange("eventType", e.target.value)}
              className={`flex h-10 w-full rounded-md border ${
                errors.eventType ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              <option value="">Select event type...</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="text-sm text-destructive mt-1">{errors.eventType}</p>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              placeholder="Any special requests or requirements for your event..."
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
              I understand the $100 booking fee is non-refundable and holds my date, time, and product. The remaining balance is due on the event date. *
            </Label>
          </div>
        </form>
      </Card>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={!agreedToTerms}
          size="lg"
          className="gradient-purple-pink glow-purple text-white font-semibold px-12"
        >
          Continue to Payment →
        </Button>
      </div>
    </div>
  );
}
