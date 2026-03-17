/**
 * Environment configuration helper
 * Provides safe access to environment variables with defaults for build time
 */

/**
 * Get environment variable with a fallback for build time
 * This allows the build to succeed even if env vars aren't set,
 * but will fail at runtime if they're actually needed
 */
export function getEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}

/**
 * Configuration object with all environment variables
 * Uses empty strings as defaults to allow build to succeed
 */
export const envConfig = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },
  
  // Email
  resend: {
    apiKey: getEnvVar('RESEND_API_KEY'),
  },
  
  // Payments
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
  },
  
  // Contact Form
  web3forms: {
    accessKey: getEnvVar('WEB3FORMS_ACCESS_KEY'),
  },
  
  // Cron
  cron: {
    secret: getEnvVar('CRON_SECRET'),
  },
  
  // Analytics (optional)
  analytics: {
    gaMeasurementId: getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
  },
} as const;

/**
 * Check if a service is properly configured
 */
export const isConfigured = {
  supabase: () => !!(envConfig.supabase.url && envConfig.supabase.anonKey),
  supabaseAdmin: () => !!(envConfig.supabase.url && envConfig.supabase.serviceRoleKey),
  resend: () => !!envConfig.resend.apiKey,
  stripe: () => !!envConfig.stripe.secretKey,
  web3forms: () => !!envConfig.web3forms.accessKey,
  cron: () => !!envConfig.cron.secret,
  analytics: () => !!envConfig.analytics.gaMeasurementId,
} as const;