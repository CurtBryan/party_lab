"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { TalkToUsModal } from "@/components/talk-to-us-modal";

export function ContactForm() {
  const [isTalkToUsOpen, setIsTalkToUsOpen] = useState(false);

  return (
    <>
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-purple">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get in touch with us and we'll help you plan the perfect party experience!
            </p>
          </div>

          <div className="bg-card border-2 border-primary rounded-2xl p-12 glow-purple text-center">
            <Button
              size="lg"
              onClick={() => setIsTalkToUsOpen(true)}
              className="text-xl px-10 py-8 gradient-purple-pink glow-purple text-white font-semibold hover:opacity-90 hover:scale-105 transition-all"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Get in Touch
            </Button>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Or reach out directly:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Call or Text</p>
                    <a
                      href="tel:+16027995856"
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      (602) 799-5856
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email us</p>
                    <a
                      href="mailto:partylabaz@gmail.com"
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      partylabaz@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TalkToUsModal
        isOpen={isTalkToUsOpen}
        onClose={() => setIsTalkToUsOpen(false)}
      />
    </>
  );
}
