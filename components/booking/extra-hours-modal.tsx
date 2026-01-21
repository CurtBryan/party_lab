"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, DollarSign, AlertCircle } from "lucide-react";

interface ExtraHoursModalProps {
  isOpen: boolean;
  totalHours: number;
  extraHours: number;
  extraHoursCost: number;
  onContinue: () => void;
  onChangeTime: () => void;
  changeButtonText?: string;
}

export function ExtraHoursModal({
  isOpen,
  totalHours,
  extraHours,
  extraHoursCost,
  onContinue,
  onChangeTime,
  changeButtonText = "Change Time",
}: ExtraHoursModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 sm:p-8 bg-card border-2 border-primary glow-purple animate-fade-in">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-glow-purple">
              Extra Hours Selected
            </h3>
            <p className="text-muted-foreground">
              Your package includes 3 hours of party time
            </p>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total time selected:</span>
              <span className="font-semibold">{totalHours} hours</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Included in package:</span>
              <span className="font-semibold">3 hours</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">Extra hours:</span>
              <span className="font-semibold text-primary">{extraHours} {extraHours === 1 ? 'hour' : 'hours'}</span>
            </div>
            {extraHours > 0 && (
              <div className="space-y-1 text-xs text-muted-foreground pl-4">
                <div className="flex justify-between">
                  <span>• First extra hour:</span>
                  <span className="font-medium">$50</span>
                </div>
                {extraHours > 1 && (
                  <div className="flex justify-between">
                    <span>• {extraHours - 1} additional {extraHours - 1 === 1 ? 'hour' : 'hours'} × $75:</span>
                    <span className="font-medium">${75 * (extraHours - 1)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-semibold">Extra hours cost:</span>
              </div>
              <span className="text-2xl font-bold text-primary">
                ${extraHoursCost}
              </span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-600 dark:text-amber-400">
                First extra hour is $50, each additional hour is $75. This will be added to your total cost.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onChangeTime}
              variant="outline"
              size="lg"
              className="flex-1 border-2"
            >
              {changeButtonText}
            </Button>
            <Button
              onClick={onContinue}
              size="lg"
              className="flex-1 gradient-purple-pink glow-purple text-white font-semibold"
            >
              Continue (Add ${extraHoursCost})
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
