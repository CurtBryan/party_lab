import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Partylab | Inflatable Nightclub Rentals Arizona | Birthday Party Entertainment",
  description: "Turn any space into a nightclub in 30 minutes! The Partylab offers inflatable nightclub rentals with LED lighting, curated playlists, and VIP setups. Perfect for birthdays, teen parties & events in Phoenix & Arizona. Starting at $400.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  keywords: [
    "inflatable nightclub rental Arizona",
    "party rentals Phoenix",
    "birthday party entertainment",
    "teen party ideas Arizona",
    "kids dance party Phoenix",
    "inflatable party dome rental",
    "LED nightclub rental",
    "Sweet 16 party ideas",
    "Quinceañera entertainment Arizona",
    "mobile nightclub rental",
    "VIP party setup Phoenix",
    "glow party rentals",
    "Disney party theme",
    "backyard party entertainment",
    "Arizona event rentals"
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
    title: "The Partylab | Inflatable Nightclub Rentals in Arizona",
    description: "Turn any space into a nightclub in 30 minutes! Inflatable nightclub rentals with LED lighting, curated playlists, and VIP setups for birthdays, teen parties & events.",
    siteName: "The Partylab",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "The Partylab - Inflatable Nightclub Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Partylab | Inflatable Nightclub Rentals Arizona",
    description: "Turn any space into a nightclub in 30 minutes! Perfect for birthdays, teen parties & events in Phoenix & Arizona.",
    images: ["/logo.png"],
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
    "image": "https://partylabaz.com/logo.png",
    "description": "Inflatable nightclub rentals with LED lighting, curated playlists, and VIP setups for parties and events in Arizona.",
    "telephone": "(555) 123-4567",
    "email": "info@partylabaz.com",
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
    "priceRange": "$400-$600",
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
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "100"
    },
    "sameAs": [
      "https://instagram.com/partylabaz",
      "https://www.facebook.com/people/Partylabaz/61579352249971"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
