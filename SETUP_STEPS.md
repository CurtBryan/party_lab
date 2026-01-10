# Quick Setup Steps for Reminder System

## Step 1: Add Database Field (2 minutes)

### Option A: Supabase Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard
2. Click on your project
3. Click "SQL Editor" in left sidebar
4. Click "New query"
5. Paste this SQL:

```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;
```

6. Click "Run" (or press Cmd+Enter)
7. You should see: "Success. No rows returned"

✅ Done! The database is ready.

---

## Step 2: Add Vercel Environment Variable (2 minutes)

### Option A: Vercel Dashboard (Easiest)
1. Go to: https://vercel.com/dashboard
2. Click on your project (party_lab)
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Click "Add New"
6. Fill in:
   - **Key:** `CRON_SECRET`
   - **Value:** `y7XvCAKAivWF6RXjb3juGCPGCkwxJ3xOFWMJvT2Sl6E=`
   - **Environments:** Check all (Production, Preview, Development)
7. Click "Save"
8. Vercel will ask to redeploy - click "Redeploy"

✅ Done! Cron job is now secured.

### Option B: Using Vercel CLI (Alternative)
If you prefer command line:

```bash
# Login first
vercel login

# Add the secret
vercel env add CRON_SECRET production
# When prompted, paste: y7XvCAKAivWF6RXjb3juGCPGCkwxJ3xOFWMJvT2Sl6E=

# Redeploy
vercel --prod
```

---

## ✅ After Both Steps Complete:

The reminder system will be fully active!

**What happens:**
- Every day at 10 AM UTC (3 AM Arizona time)
- System checks for events 48 hours away
- Sends 2 emails to partylabaz@gmail.com
- You forward customer email after reviewing

**To test it manually:**
```bash
npx tsx scripts/send-event-reminders.ts
```

---

## Need Help?

If you get stuck on either step, let me know and I can guide you through it!
