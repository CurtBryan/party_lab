# Google Analytics Setup Guide

Google Analytics is now installed on your website! Follow these steps to activate it and start tracking visitors.

## Step 1: Create a Google Analytics Account

1. Go to https://analytics.google.com
2. Click **"Start measuring"** or **"Admin"** (bottom left)
3. Click **"Create Account"**
4. Fill in your account details:
   - **Account name**: "Partylab" (or whatever you prefer)
   - Check all data sharing settings (recommended)
   - Click **"Next"**

## Step 2: Create a Property

1. **Property name**: "Partylab Website"
2. **Reporting time zone**: Select your timezone (e.g., "United States - Arizona")
3. **Currency**: USD - US Dollar
4. Click **"Next"**

## Step 3: Set Up Your Business Details

1. **Industry category**: Select "Events & Entertainment" or "Other"
2. **Business size**: Select your company size
3. **How you intend to use Google Analytics**: Check relevant boxes (e.g., "Measure advertising ROI")
4. Click **"Create"**
5. Accept the Terms of Service

## Step 4: Set Up Data Stream

1. Select **"Web"** as your platform
2. **Website URL**: `https://partylabaz.com`
3. **Stream name**: "Partylab Website"
4. Click **"Create stream"**

## Step 5: Get Your Measurement ID

After creating the stream, you'll see your **Measurement ID** at the top:
- Format: `G-XXXXXXXXXX` (starts with "G-")
- **Copy this ID** - you'll need it in the next step

## Step 6: Add Measurement ID to Your Website

1. Open your `.env.local` file in your project
2. Add this line (replace with your actual Measurement ID):
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Save the file
4. Restart your development server if it's running

**Example:**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC123DEF4
```

## Step 7: Deploy to Production

After adding the Measurement ID:
1. Commit your `.env.local` changes (or add the environment variable to your hosting provider)
2. Deploy your website
3. Google Analytics will start tracking visitors automatically!

---

## What You'll Be Able to Track

Once set up, you can see:

### Realtime Overview
- How many people are on your site right now
- Which pages they're viewing
- Where they're coming from (search, social, direct)

### Audience Data
- **Unique visitors** (daily, weekly, monthly)
- New vs. returning visitors
- Demographics (age, gender, interests)
- Device types (mobile, desktop, tablet)
- Locations (cities, states, countries)

### Acquisition Reports
- Where your traffic comes from:
  - Organic Search (Google, Bing)
  - Social Media (Instagram, Facebook)
  - Direct (typed in URL)
  - Referral (from other websites)

### Behavior Reports
- Most popular pages
- Time spent on site
- Bounce rate (people who leave immediately)
- User flow through your site

### Conversions (if you set up goals)
- Track completed bookings
- Monitor form submissions
- Measure contact form usage

---

## Viewing Your Analytics

1. Go to https://analytics.google.com
2. Click on your property ("Partylab Website")
3. Explore different reports:
   - **Realtime** - Live visitor activity
   - **Reports** → **Acquisition** - Where visitors come from
   - **Reports** → **Engagement** - What visitors do on your site
   - **Reports** → **Tech** - Devices and browsers used

---

## Setting Up Goals (Optional but Recommended)

To track bookings and form submissions:

1. In Google Analytics, click **"Admin"** (bottom left)
2. Under **Property**, click **"Events"**
3. Click **"Create event"**
4. Set up events for:
   - Booking form submissions
   - Contact form submissions
   - Button clicks

**Or** use Google Tag Manager for more advanced tracking.

---

## Privacy & GDPR Compliance

Google Analytics is GDPR-compliant when configured properly:
- We're using GA4 (Google Analytics 4) which is privacy-focused
- No personal data is sent by default
- IP addresses are anonymized

If you want to add a cookie consent banner, consider:
- https://cookieconsent.orestbida.com/
- https://www.osano.com/cookieconsent

---

## Troubleshooting

**Not seeing any data?**
1. Check that your Measurement ID is correct in `.env.local`
2. Make sure you've deployed the changes to production
3. Visit your website and check "Realtime" in Google Analytics
4. Clear your browser cache and try again

**Still not working?**
1. Open your browser's developer tools (F12)
2. Go to the "Network" tab
3. Refresh your page
4. Look for requests to `google-analytics.com` or `gtag`
5. If you don't see them, the tracking code might not be loading

---

## Next Steps

Once analytics are tracking:
1. **Set up goals** to track bookings
2. **Link to Google Search Console** for search data
3. **Set up custom reports** for your specific needs
4. **Check weekly** to see your traffic trends
5. **Share access** with team members if needed

---

## Support

- **Google Analytics Help**: https://support.google.com/analytics
- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4

Your analytics are now set up! 🎉
