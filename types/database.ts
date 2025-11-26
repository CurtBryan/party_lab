export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
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
          addon_extra_hour: boolean;
          addon_glow_bags: boolean;
          subtotal: number;
          booking_fee: number;
          total: number;
          stripe_payment_intent_id: string | null;
          payment_status: string;
          booking_status: string;
          special_requests: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          product: string;
          package: string;
          event_date: string;
          event_time_start: string;
          event_time_end: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          event_address: string;
          event_type?: string | null;
          addon_playlist_projector?: boolean;
          addon_extra_hour?: boolean;
          addon_glow_bags?: boolean;
          subtotal: number;
          booking_fee: number;
          total: number;
          stripe_payment_intent_id?: string | null;
          payment_status?: string;
          booking_status?: string;
          special_requests?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          product?: string;
          package?: string;
          event_date?: string;
          event_time_start?: string;
          event_time_end?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          event_address?: string;
          event_type?: string | null;
          addon_playlist_projector?: boolean;
          addon_extra_hour?: boolean;
          addon_glow_bags?: boolean;
          subtotal?: number;
          booking_fee?: number;
          total?: number;
          stripe_payment_intent_id?: string | null;
          payment_status?: string;
          booking_status?: string;
          special_requests?: string | null;
        };
      };
      availability_overrides: {
        Row: {
          id: string;
          created_at: string;
          override_date: string;
          time_block: string | null;
          product: string | null;
          reason: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          override_date: string;
          time_block?: string | null;
          product?: string | null;
          reason?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          override_date?: string;
          time_block?: string | null;
          product?: string | null;
          reason?: string | null;
          is_active?: boolean;
        };
      };
    };
  };
};
