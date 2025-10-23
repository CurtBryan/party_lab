"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does setup and takedown take?",
    answer: "Setup takes approximately 30 minutes, and takedown is just as quick. We handle everything from start to finish so you can focus on enjoying your event!"
  },
  {
    question: "What areas do you serve in Arizona?",
    answer: "We serve the entire Phoenix metro area including Scottsdale, Mesa, Tempe, Chandler, Gilbert, and surrounding cities. We also travel throughout Arizona - contact us for delivery availability!"
  },
  {
    question: "What's included in the rental packages?",
    answer: "All packages include the inflatable nightclub, LED lighting, sound system, and professional setup/teardown. Higher-tier packages add red carpet, glow kits, and curated playlists with video projection."
  },
  {
    question: "How many guests can the inflatable nightclub accommodate?",
    answer: "Our inflatables comfortably accommodate 20-30 guests depending on the model chosen. This is perfect for birthdays, teen parties, Sweet 16s, and family celebrations."
  },
  {
    question: "Do I need to provide power?",
    answer: "Yes, we need access to standard electrical outlets (110V) for the blower, lights, and sound system. We bring all necessary extension cords and equipment."
  },
  {
    question: "What if it rains or weather is bad?",
    answer: "Our inflatables work great indoors or outdoors! For outdoor events, we monitor weather and can reschedule if needed. Indoor setup requires adequate ceiling height and space."
  },
  {
    question: "Can I extend my rental time?",
    answer: "Absolutely! The first extra hour is $50, and each additional hour after that is $75. Just let us know during your event and we'll extend your party time."
  },
  {
    question: "What music themes are available?",
    answer: "We offer Disney, Glow Dance Party, Pop Star, '90s, EDM, Kpop, and Kids themes. Each includes a curated 1.5-hour playlist with warm-up, high energy, dance games, and finale. Custom playlists are also available!"
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-purple">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers!
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="#request-info"
            className="text-primary hover:text-primary/80 font-semibold"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("request-info")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact us for more information →
          </a>
        </div>
      </div>
    </section>
  );
}
