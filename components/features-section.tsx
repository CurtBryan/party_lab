import { Lightbulb, Music, Zap, MapPin, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "30-Minute Setup",
    description: "Turn any space into a nightclub in 30 minutes! We handle everything - you just show up and party",
    color: "text-primary",
  },
  {
    icon: Music,
    title: "Curated Playlists",
    description: "No DJ needed! Choose from themed playlists ('90s, EDM, Kpop, Kids, Disney) - just press play",
    color: "text-secondary",
  },
  {
    icon: Lightbulb,
    title: "Full VIP Experience",
    description: "Color-changing LED lighting, red carpet, and premium sound system included",
    color: "text-accent",
  },
  {
    icon: MapPin,
    title: "Options for All Ages",
    description: "From Kids Dance Parties (Disney, Glow, Pop Star) to Teen Nightclubs - perfect for any celebration",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Hassle-Free Experience",
    description: "Premium inflatables, professional sound, themed videos, and glow kits - all in one package",
    color: "text-secondary",
  },
  {
    icon: Clock,
    title: "Flexible Packages",
    description: "3-hour base rentals with easy extensions. Affordable add-ons to customize your perfect party",
    color: "text-accent",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-purple">
            Why Choose The Partylab?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We bring the complete nightclub experience to your event with professional equipment and hassle-free service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:glow-purple transition-all ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
