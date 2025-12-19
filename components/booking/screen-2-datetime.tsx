"use client";

import { useState, useEffect } from "react";
import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addHours, isAfter } from "date-fns";
import { TIME_BLOCKS, MIN_HOURS_ADVANCE } from "@/lib/constants";
import { checkAvailability } from "@/app/actions/check-availability";
import type { TimeBlock } from "@/types/booking";
import "react-day-picker/dist/style.css";

export function Screen2DateTime() {
  const { bookingData, updateDateTime, nextStep } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date ? new Date(bookingData.date) : undefined
  );
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(
    bookingData.timeBlock
  );
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");

  // Calculate minimum date (48 hours from now)
  const minDate = addHours(new Date(), MIN_HOURS_ADVANCE);

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate && bookingData.product) {
      checkAvailabilityForDate(selectedDate);
    }
  }, [selectedDate, bookingData.product]);

  const checkAvailabilityForDate = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const product = bookingData.product;

      if (!product) {
        setAvailableBlocks([]);
        return;
      }

      const result = await checkAvailability(formattedDate, product);

      if (result.success) {
        setAvailableBlocks(result.availableBlocks);
      } else {
        setAvailableBlocks([]);
      }
    } catch (error) {
      console.error("Failed to check availability:", error);
      setAvailableBlocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeBlock(null); // Reset time block when date changes
    setIsCustomTime(false);
    setCustomStartTime("");
    setCustomEndTime("");
  };

  const handleTimeBlockSelect = (block: TimeBlock) => {
    setSelectedTimeBlock(block);
    setIsCustomTime(false);
  };

  const handleCustomTimeSelect = () => {
    setIsCustomTime(true);
    setSelectedTimeBlock(null);
  };

  const handleContinue = () => {
    if (selectedDate) {
      let timeBlock: TimeBlock;

      if (isCustomTime && customStartTime && customEndTime) {
        timeBlock = `${customStartTime}-${customEndTime}`;
      } else if (selectedTimeBlock) {
        timeBlock = selectedTimeBlock;
      } else {
        return;
      }

      updateDateTime(format(selectedDate, "yyyy-MM-dd"), timeBlock);
      nextStep();
    }
  };

  // Filter time blocks based on day of week
  const getAvailableTimeBlocks = () => {
    if (!selectedDate) return TIME_BLOCKS;

    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      // Weekend: Show all time slots
      return TIME_BLOCKS;
    } else {
      // Weekday (Mon-Fri): Only show 5:00 PM - 8:00 PM
      return TIME_BLOCKS.filter(block => block.value === "17:00-20:00");
    }
  };

  const isCustomTimeValid = customStartTime && customEndTime && customStartTime < customEndTime;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-glow-purple">
          Pick Your Date & Time
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select a date at least 48 hours in advance
        </p>
        {bookingData.product && (
          <p className="text-sm text-muted-foreground mt-2">
            Venue: <span className="text-primary font-semibold">{bookingData.product}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Calendar */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Select Date
          </h3>
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={[
                { before: minDate },
              ]}
              className="border rounded-lg p-4"
              styles={{
                day_selected: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                },
                day_today: {
                  fontWeight: "bold",
                },
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            For bookings within 48 hours, please call (602) 799-5856
          </p>
        </Card>

        {/* Time Blocks */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Select Time Block</h3>
          {!selectedDate ? (
            <p className="text-muted-foreground text-center py-8">
              Please select a date first
            </p>
          ) : isLoading ? (
            <p className="text-muted-foreground text-center py-8">
              Checking availability...
            </p>
          ) : (
            <div className="space-y-3">
              {getAvailableTimeBlocks().map((block) => {
                const isAvailable = availableBlocks.includes(block.value);
                const isSelected = selectedTimeBlock === block.value;

                return (
                  <button
                    key={block.value}
                    onClick={() => isAvailable && handleTimeBlockSelect(block.value as TimeBlock)}
                    disabled={!isAvailable}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 glow-purple"
                        : isAvailable
                        ? "border-border hover:border-primary hover:bg-primary/5"
                        : "border-border bg-muted opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{block.label}</span>
                      <span className="text-sm text-muted-foreground">3 hours</span>
                    </div>
                    {!isAvailable && (
                      <p className="text-xs text-muted-foreground mt-1">Not available</p>
                    )}
                  </button>
                );
              })}

              {/* Custom Time Option */}
              <button
                onClick={handleCustomTimeSelect}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isCustomTime
                    ? "border-primary bg-primary/10 glow-purple"
                    : "border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Custom Time
                  </span>
                  <span className="text-sm text-muted-foreground">Choose your own</span>
                </div>
              </button>

              {/* Custom Time Inputs */}
              {isCustomTime && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startTime" className="text-sm font-medium">
                        Start Time
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={customStartTime}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-sm font-medium">
                        End Time
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    {customStartTime && customEndTime && (
                      <p className="text-xs text-muted-foreground">
                        {customStartTime < customEndTime ? (
                          <span className="text-green-500">
                            ✓ Duration: {Math.round((new Date(`1970-01-01T${customEndTime}`).getTime() - new Date(`1970-01-01T${customStartTime}`).getTime()) / (1000 * 60 * 60) * 10) / 10} hours
                          </span>
                        ) : (
                          <span className="text-red-500">End time must be after start time</span>
                        )}
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || (!selectedTimeBlock && !isCustomTimeValid)}
          size="lg"
          className="gradient-purple-pink glow-purple text-white font-semibold px-12"
        >
          Continue to Packages →
        </Button>
      </div>
    </div>
  );
}
