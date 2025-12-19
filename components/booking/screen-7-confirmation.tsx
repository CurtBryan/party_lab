"use client";

import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface Screen7ConfirmationProps {
  onClose: () => void;
}

export function Screen7Confirmation({ onClose }: Screen7ConfirmationProps) {
  const { bookingData, resetBooking } = useBooking();

  if (!bookingData.customer || !bookingData.date || !bookingData.timeBlock || !bookingData.bookingId) {
    return <div>Error: Missing booking information</div>;
  }

  const formattedDate = format(new Date(bookingData.date), "MMMM d, yyyy");
  const [startTime, endTime] = bookingData.timeBlock.split("-");

  // Convert military time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 glow-purple mb-6">
          <CheckCircle2 className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-5xl font-bold mb-4 text-glow-purple">
          You're Booked!
        </h2>
        <p className="text-xl text-muted-foreground">
          Your party is confirmed and we're ready to bring the nightclub to you! 🎉
        </p>
      </div>

      {/* Booking Details Card */}
      <Card className="p-8 border-2 border-primary glow-purple">
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Booking ID</div>
            <div className="text-2xl font-bold font-mono text-primary">{bookingData.bookingId}</div>
            <p className="text-xs text-muted-foreground mt-1">Save this for your records</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Product</div>
              <div className="font-semibold">{bookingData.product}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Package</div>
              <div className="font-semibold">{bookingData.package}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Date</div>
              <div className="font-semibold">{formattedDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Time</div>
              <div className="font-semibold">{formattedStartTime} - {formattedEndTime}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-muted-foreground mb-2">Location</div>
              <div className="font-semibold">{bookingData.customer.address}</div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Booking Fee Paid</span>
              <span className="font-semibold">${bookingData.pricing.bookingFee}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Remaining Balance</span>
              <span className="text-primary">${bookingData.pricing.total - bookingData.pricing.bookingFee}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Due on event date
            </p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">Confirmation Email Sent</div>
              <p className="text-sm text-muted-foreground">
                Check your inbox at {bookingData.customer.email} for all the details and your booking confirmation.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">We'll Be There Early</div>
              <p className="text-sm text-muted-foreground">
                Our team will arrive 30 minutes before your event starts to set everything up perfectly.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">Questions?</div>
              <p className="text-sm text-muted-foreground">
                Call us at (602) 799-5856 or reply to your confirmation email anytime!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          onClick={handleClose}
          size="lg"
          className="flex-1 gradient-purple-pink glow-purple text-white font-semibold"
        >
          Done
        </Button>
        <Button
          onClick={() => window.print()}
          size="lg"
          variant="outline"
          className="flex-1"
        >
          Print Confirmation
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Thank you for choosing The Partylab!</p>
        <p className="mt-1">Get ready for an unforgettable celebration 🎊</p>
      </div>
    </div>
  );
}
