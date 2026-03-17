/**
 * Environment variable validation
 * This file checks for required environment variables and provides helpful error messages
 */

type EnvVar = {
  name: string;
  required: boolean;
  description: string;
  example?: string;
};

const envVars: EnvVar[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxxxxxxxxxx.supabase.co'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key (public)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    description: 'Supabase service role key (server-side only)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    name: 'RESEND_API_KEY',
    required: true,
    description: 'Resend API key for sending emails',
    example: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    required: true,
    description: 'Stripe secret key for payment processing',
    example: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    name: 'WEB3FORMS_ACCESS_KEY',
    required: true,
    description: 'Web3Forms access key for contact form',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  },
  {
    name: 'CRON_SECRET',
    required: true,
    description: 'Secret key for authenticating cron jobs',
    example: 'your-secure-random-string-here'
  },
  {
    name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    description: 'Google Analytics Measurement ID (optional)',
    example: 'G-XXXXXXXXXX'
  }
];

/**
 * Check if all required environment variables are set
 * Returns an object with missing variables and whether all required ones are present
 */
export function checkEnvVars(): { 
  isValid: boolean; 
  missing: string[]; 
  warnings: string[] 
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const envVar of envVars) {
    const value = process.env[envVar.name];
    
    if (!value || value.trim() === '') {
      if (envVar.required) {
        missing.push(envVar.name);
      } else {
        warnings.push(`Optional: ${envVar.name} is not set (${envVar.description})`);
      }
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * Get a formatted error message for missing environment variables
 */
export function getEnvErrorMessage(missing: string[]): string {
  const details = missing.map(name => {
    const envVar = envVars.find(v => v.name === name);
    return `  • ${name}: ${envVar?.description || 'Required'}${envVar?.example ? `\n    Example: ${envVar.example}` : ''}`;
  }).join('\n');

  return `
❌ Missing Required Environment Variables:

${details}

📝 To fix this:
1. Copy .env.example to .env.local
2. Fill in the missing values
3. For Vercel deployment, add these to your project settings:
   https://vercel.com/[your-team]/[your-project]/settings/environment-variables

See .env.example for detailed instructions.
`.trim();
}

/**
 * Validate environment variables and log results
 * Use this in development to catch missing vars early
 */
export function validateEnv(): void {
  const { isValid, missing, warnings } = checkEnvVars();
  
  if (!isValid) {
    console.error(getEnvErrorMessage(missing));
    
    // Only throw in development, not in production build
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Environment Variable Warnings:\n' + warnings.join('\n'));
  }
}