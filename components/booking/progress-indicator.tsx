"use client";

import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground glow-purple"
                      : isCurrent
                      ? "border-primary text-primary glow-purple"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-center hidden sm:block">
                  {step === 1 && "Product"}
                  {step === 2 && "Date & Time"}
                  {step === 3 && "Package"}
                  {step === 4 && "Add-Ons"}
                  {step === 5 && "Info"}
                  {step === 6 && "Payment"}
                  {step === 7 && "Done"}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
