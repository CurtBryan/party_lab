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
    price: 250,
    description: "Perfect for intimate celebrations",
    features: [
      "3-hour rental",
      "LED lighting system",
      "Premium sound system",
      "Setup & takedown included",
    ],
    glowColor: "purple",
  },
  {
    name: "Glow Getter",
    price: 350,
    description: "Light up the night with premium features",
    features: [
      "Everything in Party Starter",
      "Glow sticks & LED accessories",
      "Neon decorations",
      "Photo backdrop setup",
    ],
    glowColor: "pink",
    featured: true,
  },
  {
    name: "All-Star VIP",
    price: 500,
    description: "The ultimate party experience",
    features: [
      "Everything in Glow Getter",
      "VIP entrance setup",
      "Premium photo props",
      "Custom lighting programming",
      "DJ equipment setup",
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
    id: "extraHour",
    name: "Extra Hour",
    price: 75,
    description: "Extend your party by one additional hour",
  },
  {
    id: "glowBags",
    name: "Glow-Up Party Bags",
    price: 50,
    description: "Party favor bags with glow accessories for all guests",
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
