export type ProductType = "Dance Dome" | "Light Haus" | "Club Noir";
export type PackageType = "Party Starter" | "Glow Getter" | "All-Star VIP";
export type TimeBlock = "10:00-13:00" | "13:30-16:30" | "17:00-20:00" | string;

export interface AddOns {
  playlistProjector: boolean;
  redRopesCarpet: boolean;
  extraHour: boolean;
  glowBags: boolean;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  eventType: string;
  specialRequests?: string;
  // Pre-Event Readiness Checklist (Required)
  spaceType: string;
  powerSource: "Yes" | "No" | "N/A" | string;
  wifiMusicAccess: "Yes" | "No" | "N/A" | string;
  surfaceType: string;
  accessPath: "Yes" | "No" | "N/A" | string;
}

export interface Pricing {
  subtotal: number;
  bookingFee: number;
  extraHours: number;
  extraHoursCost: number;
  tripCharge: number;
  total: number;
}

export interface BookingData {
  currentStep: number;
  product: ProductType | null;
  date: string | null;
  timeBlock: TimeBlock | null;
  package: PackageType | null;
  addOns: AddOns;
  customer: CustomerInfo | null;
  pricing: Pricing;
  bookingId: string | null;
  paymentIntentId: string | null;
  clientSecret: string | null;
}

export interface Product {
  name: ProductType;
  description: string;
  capacity: string;
  dimensions: string;
  imageUrl: string;
  glowColor: "purple" | "pink" | "teal";
}

export interface Package {
  name: PackageType;
  price: number;
  description: string;
  features: string[];
  glowColor: "purple" | "pink" | "teal";
  featured?: boolean;
}

export interface AddOnOption {
  id: keyof AddOns;
  name: string;
  price: number;
  description: string;
}

export interface BookingRecord {
  id: string;
  created_at: string;
  product: string;
  package: string;
  event_date: string;
  event_time_start: string;
  event_time_end: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_address: string;
  event_type: string | null;
  addon_playlist_projector: boolean;
  addon_red_ropes_carpet: boolean;
  addon_extra_hour: boolean;
  addon_glow_bags: boolean;
  subtotal: number;
  booking_fee: number;
  total: number;
  stripe_payment_intent_id: string | null;
  payment_status: string;
  booking_status: string;
  special_requests: string | null;
  // Pre-Event Readiness Checklist
  space_type: string | null;
  power_source: string | null;
  wifi_music_access: string | null;
  surface_type: string | null;
  access_path: string | null;
}
