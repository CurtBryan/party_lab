"use client";

import { useState } from "react";
import { X, Sun } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative w-full px-4 py-3 sm:py-4 text-center"
      style={{
        background: "linear-gradient(135deg, #b45309 0%, #d97706 30%, #f59e0b 60%, #ef4444 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2 flex-1">
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-white text-xs sm:text-sm leading-snug text-left">
            <span className="font-bold">Thank you for an incredible first year! 🎉</span>
            {" "}We are so grateful for every family that trusted us with their celebrations.
            Due to the Arizona summer heat, we are{" "}
            <span className="font-semibold underline">closing summer bookings</span>{" "}
            for the season.{" "}
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-bold underline hover:no-underline transition-all cursor-pointer"
            >
              Reach out to us
            </button>
            {" "}to talk about future bookings — we can&apos;t wait to party with you when the weather cools down!
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 text-white/80 hover:text-white transition-colors p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
