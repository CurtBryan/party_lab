import { Lightbulb, Music, Users } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Immersive Club Vibes",
    description: "Inflatable nightclubs with LED lighting and projected dance videos create a high-energy, fully immersive experience.",
    color: "text-primary",
  },
  {
    icon: Music,
    title: "Curated Playlists",
    description: "No DJ needed—just press play and choose from themed playlists for every age and vibe.",
    color: "text-secondary",
  },
  {
    icon: Users,
    title: "Made for All Ages",
    description: "From kids' dance parties to teen nightclub experiences, PartyLab brings the energy to every celebration.",
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
            Experience the ultimate party with our inflatable nightclubs, designed to bring unforgettable energy to any celebration.
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
