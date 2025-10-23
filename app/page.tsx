import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { PackageCard } from "@/components/package-card";
import { EmailForm } from "@/components/email-form";
import { FAQSection } from "@/components/faq-section";
import { Instagram, Mail, Phone, Check, Music } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Packages Section */}
      <section id="packages" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-pink">
              Choose Your Package
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From intimate gatherings to epic celebrations, we have the perfect inflatable nightclub package for your event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PackageCard
              name="Party Starter"
              description="Perfect for birthdays & small gatherings"
              price="$400"
              features={[
                "Color-Changing LED Lighting",
                "Bluetooth Speaker Sound System",
                "3-Hour Rental",
                "Setup & Teardown Included",
                "Dance Dome option: $375",
              ]}
              glowColor="purple"
              imageUrl="/box_shape.JPG"
            />

            <PackageCard
              name="Glow Getter"
              description="A VIP vibe with built-in extras"
              price="$500"
              features={[
                "Red Ropes & Carpet",
                "LED Lighting + Bluetooth Sound System",
                "Glow Up Kit (20) Included",
                "Curated Playlist + Themed Video Projector",
                "3-Hour Rental",
                "Setup & Teardown Included",
                "Dance Dome option: $450",
              ]}
              glowColor="pink"
              featured={true}
              imageUrl="/igloo_shape.jpg"
            />

            <PackageCard
              name="All-Star VIP"
              description="Your own private nightclub"
              price="$600"
              features={[
                "Red Ropes & Carpet",
                "Premium LED Lighting & Sound System",
                "Wireless Microphone Included",
                "Glow Up Kit (20) Included",
                "Curated Playlist + Themed Video Projector",
                "3-Hour Rental",
                "Setup & Teardown Included",
                "Capacity: 20-30 guests",
                "Dance Dome option: $525",
              ]}
              glowColor="teal"
              imageUrl="/house_shape.jpg"
            />
          </div>

          {/* Add-Ons Section */}
          <div className="mt-16 bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">
              Customize Your Experience
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">$75</div>
                <div className="font-semibold text-foreground mb-1">Extra Hour</div>
                <div className="text-sm text-muted-foreground">Keep the party going</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">$50</div>
                <div className="font-semibold text-foreground mb-1">Glow Up Party Bags</div>
                <div className="text-sm text-muted-foreground">20 bags included</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">$100</div>
                <div className="font-semibold text-foreground mb-1">Playlist + Projector</div>
                <div className="text-sm text-muted-foreground">Curated music & videos</div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              VIP Extension: First extra hour $50, each additional hour $75
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-2">
              All packages include setup and teardown. Turn any space into a nightclub in 30 minutes!
            </p>
            <p className="text-sm text-muted-foreground">
              Serving the Phoenix metro area and throughout Arizona.
            </p>
          </div>
        </div>
      </section>

      {/* Curated Playlist Themes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-purple">
              Curated Playlist Themes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Add the perfect soundtrack to your inflatable nightclub! Parents don't need to DJ—just press play.
              Each theme includes a 1.5 hour curated music flow with warm-up, high energy, dance games, and finale.
            </p>
          </div>

          <div className="bg-card border-2 border-primary rounded-lg p-8 mb-12 text-center glow-purple">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary rounded-full px-6 py-2 mb-4">
              <Music className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Playlist + Projector Add-On: $100</span>
            </div>
            <p className="text-muted-foreground">
              Includes curated themed playlist, music video projector setup, and complete music flow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-all hover:scale-105">
              <div className="text-5xl mb-4 text-center">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-primary">
                Glow Dance Party
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Neon, LED balloons, glow sticks & upbeat hits. Perfect with Glow Haus or Lightwave domes!
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Spotify Playlist ready-to-go
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  YouTube "Play All" video option
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Perfect for kids parties
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 hover:border-secondary transition-all hover:scale-105">
              <div className="text-5xl mb-4 text-center">🏰</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-secondary">
                Disney Dance Party
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Princesses, heroes & singalong favorites. Great for birthdays & family celebrations!
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-secondary" />
                  Spotify Playlist ready-to-go
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-secondary" />
                  YouTube "Play All" video option
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-secondary" />
                  All-ages friendly
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 hover:border-accent transition-all hover:scale-105">
              <div className="text-5xl mb-4 text-center">🎤</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-accent">
                Pop Star Party
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Karaoke vibes with microphones & inflatable guitars. Kids become the rockstars!
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Spotify Playlist ready-to-go
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  YouTube "Play All" video option
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  Interactive performance fun
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Additional theme options available: '90s, EDM, Kpop, and more! Ask us about custom playlists.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section - Hidden for now */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow-teal">
              See the Magic
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out some amazing moments from our inflatable nightclub events
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
              "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
              "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
              "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
              "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
            ].map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Email Form Section */}
      <EmailForm />

      {/* FAQ Section */}
      <FAQSection />

      {/* Social Proof / Testimonials Placeholder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-glow-teal">
            Ready to Party?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of satisfied customers who have transformed their events into unforgettable nightclub experiences with The Partylab.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            <span className="px-4 py-2 bg-card rounded-full border border-border hover:border-primary transition-colors">
              Birthdays
            </span>
            <span className="px-4 py-2 bg-card rounded-full border border-border hover:border-primary transition-colors">
              Teen Nights
            </span>
            <span className="px-4 py-2 bg-card rounded-full border border-border hover:border-primary transition-colors">
              Sweet 16s
            </span>
            <span className="px-4 py-2 bg-card rounded-full border border-border hover:border-primary transition-colors">
              Quinceañeras
            </span>
            <span className="px-4 py-2 bg-card rounded-full border border-border hover:border-primary transition-colors">
              Graduations
            </span>
            <span className="px-4 py-2 bg-card rounded-full border border-border hover:border-primary transition-colors">
              Family Events
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <Image
                  src="/logo.png"
                  alt="The Partylab"
                  width={150}
                  height={150}
                  className="w-32 h-32"
                />
              </div>
              <p className="text-muted-foreground">
                Arizona's premier inflatable nightclub for kids. Bringing the party to you, one event at a time.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                Contact Us
              </h4>
              <div className="space-y-3">
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </a>
                <a
                  href="mailto:info@partylabaz.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@partylabaz.com</span>
                </a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/partylabaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:glow-purple transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/people/Partylabaz/61579352249971"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-secondary hover:glow-pink transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} The Partylab. All rights reserved. Serving all of Arizona with pride.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
