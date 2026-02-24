import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent invisible text flash
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Partylab AZ | Inflatable Nightclub Rentals for Kids Parties | Phoenix Arizona",
  description: "Partylab brings the party to you! Inflatable nightclub rentals with LED lights, disco ball, fog machine & curated playlists. Perfect for kids birthday parties, teen events, school dances & community events in Phoenix, Scottsdale, Mesa, Tempe & all Arizona. Book now - starting at $250!",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-small.png",
  },
  keywords: [
    "partylab",
    "party lab",
    "partylab az",
    "partylabaz",
    "inflatable nightclub",
    "inflatable nightclub rental",
    "inflatable nightclub for kids",
    "kids party ideas",
    "kids birthday party ideas",
    "kids birthday party Phoenix",
    "kids dance party",
    "birthday party entertainment Phoenix",
    "birthday party rentals Arizona",
    "teen party ideas",
    "teen birthday party Phoenix",
    "Sweet 16 party ideas Arizona",
    "inflatable party dome",
    "inflatable disco",
    "mobile nightclub rental",
    "LED party rental",
    "glow party for kids",
    "bounce house nightclub",
    "party rentals Phoenix",
    "party rentals Scottsdale",
    "party rentals Mesa",
    "party rentals Tempe",
    "party rentals Gilbert",
    "party rentals Chandler",
    "school dance party",
    "PTO event entertainment",
    "school carnival rentals",
    "community event rentals Arizona",
    "backyard party entertainment",
    "VIP party setup kids",
    "disco party for kids",
    "unique birthday party ideas Arizona"
  ],
  authors: [{ name: "The Partylab" }],
  creator: "The Partylab",
  publisher: "The Partylab",
  metadataBase: new URL("https://partylabaz.com"),
  alternates: {
    canonical: "https://partylabaz.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://partylabaz.com",
    title: "Partylab AZ | Inflatable Nightclub Rentals for Kids Parties",
    description: "Partylab brings the party to you! Inflatable nightclub with LED lights, disco ball & fog machine. Perfect for kids birthday parties, teen events & school dances in Phoenix, Arizona.",
    siteName: "Partylab AZ",
    images: [
      {
        url: "/hero.JPG",
        width: 1200,
        height: 630,
        alt: "Partylab AZ - Inflatable Nightclub for Kids Birthday Parties in Arizona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partylab AZ | Inflatable Nightclub for Kids Parties",
    description: "Partylab brings the party to you! Inflatable nightclub with LED lights & disco vibes. Perfect for kids birthdays, teen parties & school events in Phoenix, Arizona.",
    images: ["/hero.JPG"],
    creator: "@partylabaz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when you get them
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "The Partylab",
    "image": "https://partylabaz.com/hero.JPG",
    "description": "Partylab AZ offers inflatable nightclub rentals for kids birthday parties, teen events, school dances, and community events. Features LED lighting, disco ball, fog machine, and curated playlists. Serving Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert and all Arizona.",
    "telephone": "(602) 799-5856",
    "email": "partylabaz@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Phoenix",
      "addressRegion": "AZ",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.4484",
      "longitude": "-112.0740"
    },
    "url": "https://partylabaz.com",
    "priceRange": "$250-$600",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "22:00"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Arizona"
      },
      {
        "@type": "City",
        "name": "Phoenix"
      },
      {
        "@type": "City",
        "name": "Scottsdale"
      },
      {
        "@type": "City",
        "name": "Mesa"
      },
      {
        "@type": "City",
        "name": "Tempe"
      },
      {
        "@type": "City",
        "name": "Chandler"
      },
      {
        "@type": "City",
        "name": "Gilbert"
      },
      {
        "@type": "City",
        "name": "Glendale"
      },
      {
        "@type": "City",
        "name": "Peoria"
      },
      {
        "@type": "City",
        "name": "Surprise"
      },
      {
        "@type": "City",
        "name": "Queen Creek"
      },
      {
        "@type": "City",
        "name": "Goodyear"
      },
      {
        "@type": "City",
        "name": "Avondale"
      },
      {
        "@type": "City",
        "name": "Buckeye"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "3"
    },
    "sameAs": [
      "https://instagram.com/partylabaz",
      "https://www.facebook.com/people/Partylabaz/61579352249971"
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch as fallback */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
