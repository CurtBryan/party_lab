import { Sun } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <div
      className="w-full px-4 py-3 sm:py-4 text-center"
      style={{
        background: "linear-gradient(135deg, #b45309 0%, #d97706 30%, #f59e0b 60%, #ef4444 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-start sm:items-center justify-center gap-2">
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-white text-xs sm:text-sm leading-snug text-left">
          <span className="font-bold">Thank you for an incredible first year! 🎉</span>
          {" "}We are so grateful for every family that trusted us with their celebrations.
          Due to the Arizona summer heat, we are{" "}
          <span className="font-semibold underline">closing summer bookings</span>{" "}
          for the season.{" "}
          <a
            href="mailto:partylabaz@gmail.com"
            className="font-bold underline hover:no-underline transition-all"
          >
            Reach out to us
          </a>
          {" "}to talk about future bookings — we can&apos;t wait to party with you when the weather cools down!
        </p>
      </div>
    </div>
  );
}
