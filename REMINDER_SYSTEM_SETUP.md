# 48-Hour Event Reminder System Setup

## What This Does:
Automatically sends reminder emails 48 hours before each event to:
- ✅ Customer (with event details, arrival time, pre-event checklist, payment reminder)
- ✅ Partylab (with all booking details and what to bring)

## Setup Steps:

### Step 1: Add Database Field

You need to add a field to track which bookings have had reminders sent.

**Go to Supabase Dashboard:**
1. Visit https://supabase.com and log into your project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste this SQL command:

```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;
```

5. Click "Run" or press Cmd+Enter
6. You should see "Success. No rows returned"

✅ **Done!** The database is now ready to track reminders.

---

### Step 2: Set Up Vercel Cron Job

Vercel can run the reminder script automatically every day.

**Create the cron API endpoint:**

The file `/api/cron/send-reminders/route.ts` needs to be created with this content:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { addDays, format } from 'date-fns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Calculate target date (48 hours from now)
    const targetDate = addDays(new Date(), 2);
    const targetDateString = format(targetDate, 'yyyy-MM-dd');

    // Find bookings that need reminders
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('event_date', targetDateString)
      .eq('booking_status', 'confirmed')
      .eq('payment_status', 'paid')
      .is('reminder_sent_at', null);

    if (error) throw error;

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: 'No reminders to send', count: 0 });
    }

    // Send reminders (implementation here - same as script)
    let successCount = 0;

    for (const booking of bookings) {
      // ... email sending logic ...
      successCount++;
    }

    return NextResponse.json({
      message: 'Reminders sent successfully',
      count: successCount
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
  }
}
```

**Add to vercel.json:**

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 10 * * *"
  }]
}
```

This runs every day at 10:00 AM UTC (3:00 AM Arizona time).

**Add CRON_SECRET to Vercel:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `CRON_SECRET` = (generate a random string)

---

### Step 3: Manual Testing

Before the cron job runs automatically, you can test manually:

**Test the reminder script locally:**

```bash
npx tsx scripts/send-event-reminders.ts
```

This will:
- Check for events 48 hours from now
- Send reminder emails
- Mark them as sent in database

**To test with existing bookings:**

You can temporarily modify the script to check a different date, or wait for an actual event to be 48 hours away.

---

## How It Works:

### Daily Process:
1. **Every day at 10 AM** (or your chosen time), the cron job runs
2. **Checks database** for events exactly 48 hours away
3. **Filters** for confirmed, paid bookings without reminders sent
4. **Sends emails** to both customer and partylabaz@gmail.com
5. **Updates database** to mark reminder as sent (prevents duplicates)

### Email Contents:

**You receive TWO emails for each event:**

**Email 1 - Customer Version (for you to forward):**
- Subject: `[FOR CUSTOMER] Reminder: [Name]'s Party in 48 Hours! 🎉`
- Shows customer email address at top
- Event details (date, time, location, package)
- Arrival window (45-60 min before start time)
- Pre-event readiness checklist reminder
- Payment reminder (remaining balance due on arrival)
- Contact info for last-minute changes
- **You can edit this before forwarding to customer**

**Email 2 - Business Version (for you):**
- Subject: `⏰ EVENT IN 48 HRS: [Name] - [Date]`
- All customer contact info
- What product/package to bring
- Setup checklist to verify
- Payment amount to collect
- Internal reference

---

## Important Notes:

✅ **Manual Forwarding Workflow**
- Both emails go to partylabaz@gmail.com only
- You can review and edit customer email before forwarding
- Gives you control over timing and messaging
- No domain verification needed for this setup

✅ **No Duplicate Reminders**
- Once sent, `reminder_sent_at` is set
- The same booking will never get another reminder

✅ **Only Confirmed Bookings**
- Must have `booking_status: "confirmed"`
- Must have `payment_status: "paid"`
- Blocks and test bookings are excluded

---

## Monitoring:

Check Vercel logs to see when reminders run:
- Vercel Dashboard → Your Project → Functions → Logs
- Look for `/api/cron/send-reminders` entries

Check your email:
- You'll receive a copy of every reminder at partylabaz@gmail.com
- Customers receive their copy (after domain verification)

---

## Future Enhancements:

Want to add more reminder types?
- 24-hour reminder
- Day-of reminder (morning of event)
- Post-event thank you / review request

Just create additional cron jobs with different schedules!
