import type { Product, Package, AddOnOption } from "@/types/booking";

export const PRODUCTS: Product[] = [
  {
    name: "Dance Dome",
    description: "Classic igloo-style inflatable nightclub perfect for any celebration",
    capacity: "10-15 guests",
    dimensions: "16x16",
    imageUrl: "/igloo_shape.jpg",
    glowColor: "pink",
  },
  {
    name: "Light Haus",
    description: "Modern cube design with maximum space and style",
    capacity: "20-30 guests",
    dimensions: "20x20x12",
    imageUrl: "/box_shape.JPG",
    glowColor: "purple",
  },
  {
    name: "Club Noir",
    description: "Premium house-style venue for the ultimate party experience",
    capacity: "20-30 guests",
    dimensions: "23x16x12",
    imageUrl: "/house_shape.jpg",
    glowColor: "teal",
  },
];

export const PACKAGES: Package[] = [
  {
    name: "Party Starter",
    price: 300,
    description: "Perfect for birthdays & small gatherings",
    features: [
      "Color-Changing LED Lighting",
      "Bluetooth Speaker Sound System",
      "3-Hour Rental",
      "Setup & Teardown Included",
      "⚠️ Note: LED lights have limited visibility in daylight",
    ],
    glowColor: "purple",
  },
  {
    name: "Glow Getter",
    price: 400,
    description: "A VIP vibe with built-in extras",
    features: [
      "Everything in Party Starter",
      "Red Ropes & Carpet",
      "Glow Up Kit (20) Included",
      "Wireless Microphones Included",
      "Curated Playlist",
      "⚠️ Note: LED lights have limited visibility in daylight",
    ],
    glowColor: "pink",
    featured: true,
  },
  {
    name: "All-Star VIP",
    price: 500,
    description: "Big wins deserve big celebrations! The All-Star VIP Package brings extra time, nonstop music, and the full nightclub experience — perfect for schools, teams, and community events ready to party all night!",
    features: [
      "Everything in Glow Getter",
      "Themed Video Projector",
      "Extended hours included",
      "Overnight Parties",
      "⚠️ Note: LED lights have limited visibility in daylight",
    ],
    glowColor: "teal",
  },
];

export const ADD_ONS: AddOnOption[] = [
  {
    id: "playlistProjector",
    name: "Playlist + Projector",
    price: 100,
    description: "Curated themed playlist with music video projector setup",
  },
  {
    id: "redRopesCarpet",
    name: "Red Ropes & Carpet",
    price: 40,
    description: "VIP entrance with red carpet and velvet ropes",
  },
  {
    id: "extraHour",
    name: "Extra Hour",
    price: 50,
    description: "Extend your party by one additional hour",
  },
  {
    id: "glowBags",
    name: "Glow-Up Party Bags",
    price: 50,
    description: "Party favor bags with glow accessories for up to 20 guests",
  },
];

export const TIME_BLOCKS = [
  { value: "10:00-13:00", label: "10:00 AM - 1:00 PM" },
  { value: "13:30-16:30", label: "1:30 PM - 4:30 PM" },
  { value: "17:00-20:00", label: "5:00 PM - 8:00 PM" },
];

export const EVENT_TYPES = [
  "Birthday Party",
  "Teen Night",
  "Sweet 16",
  "Quinceañera",
  "Graduation",
  "School Event",
  "Family Celebration",
  "Other",
];

export const BOOKING_FEE = 100;

// Minimum hours in advance for booking
export const MIN_HOURS_ADVANCE = 48;
