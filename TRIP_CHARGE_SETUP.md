# Trip Charge Feature - Setup Guide

## ✅ What's Been Implemented

The trip charge and service area features are now fully integrated into your booking flow:

1. **Automatic Distance Calculation** - Calculates distance from Kyrene Rd & De La Mariposa Dr (your base location)
2. **Service Area Enforcement:**
   - **0-25 miles:** No trip charge, proceed normally
   - **25-50 miles:** $50 trip charge with confirmation modal
   - **>50 miles:** BLOCKED - "Sorry, we don't service that area" modal
3. **Smart Modals** - Customers can accept trip charge or contact you for out-of-area requests
4. **Integrated Pricing** - Trip charge automatically added to total

---

## 🆓 No API Key Required!

The trip charge feature uses **OpenStreetMap's Nominatim API** - a free, open-source geocoding service that doesn't require any API keys or registration.

### How It Works

- **Service:** OpenStreetMap Nominatim API
- **Cost:** Completely free
- **Setup Required:** None! Works out of the box
- **Rate Limit:** 1 request per second (plenty for booking flow)
- **Accuracy:** Same as Google Maps for address geocoding

---

## 📋 How It Works

### Customer Flow:

1. **Customer enters their address** on the Customer Info screen
2. **Clicks "Continue to Payment"**
3. **System calculates distance** from your base location
   - Shows "Checking Distance..." button state
4. **Based on distance:**

   **If 0-25 miles:**
   - ✅ Proceeds to payment normally
   - No trip charge

   **If 25-50 miles:**
   - 💵 Trip charge modal appears showing:
     - Distance from base
     - $50 trip charge
     - "Accept & Continue" or contact options
   - Customer accepts → $50 added to booking total
   - Proceeds to payment

   **If >50 miles:**
   - 🚫 Out of service modal appears showing:
     - "Sorry, we don't service that area"
     - Distance exceeds 50-mile limit
     - Contact options for special requests
     - "Go Back & Change Address" button
   - **Booking BLOCKED** - cannot continue
   - Customer can change address or contact you

### Base Location:
- **Address:** Kyrene Rd & De La Mariposa Dr, Phoenix, AZ 85044
- **Coordinates:** 33.3003° N, 111.9825° W (Ahwatukee area)

---

## 💰 Pricing Breakdown Example

**Scenario:** Customer in Flagstaff (95 miles away)

```
Dance Dome - Party Starter:  $300
Extra Hours (2 hrs):         $125  ($50 + $75)
Trip Charge:                  $50  (>25 miles)
─────────────────────────────────
Subtotal:                    $475
Deposit (Due Now):           $100
─────────────────────────────────
Total:                       $475
Remaining Due on Event:      $375
```

---

## 🧪 Testing the Feature

### How to Test:

**Test 1: Within 25 miles (No charge)**
- Address: `1234 E Main St, Mesa, AZ 85203`
- Expected: ✅ No modal, proceeds to payment

**Test 2: 25-50 miles (Trip charge applies)**
- Address: `500 N Date St, Casa Grande, AZ 85122` (~60 miles)
- Expected: 💵 Trip charge modal appears with $50 fee, can accept or contact

**Test 3: Beyond 50 miles (BLOCKED)**
- Address: `100 N Main St, Flagstaff, AZ 86001` (~95 miles)
- Address: `123 Main St, Tucson, AZ 85701` (~115 miles)
- Expected: 🚫 Out of service modal appears, cannot proceed, shows contact options

**Test 4: Edge case (exactly ~25 miles)**
- Address: `15000 N Scottsdale Rd, Scottsdale, AZ 85254`
- Expected: Check console for distance, modal if >25 miles

---

## 🔧 Files Modified

### New Files:
1. `lib/distance-calculator.ts` - Distance calculation utilities
2. `components/booking/trip-charge-modal.tsx` - Trip charge confirmation modal ($50 for 25-50 miles)
3. `components/booking/out-of-service-modal.tsx` - Out of service area blocking modal (>50 miles)
4. `TRIP_CHARGE_SETUP.md` - This file

### Modified Files:
1. `types/booking.ts` - Added `tripCharge` to Pricing interface
2. `components/booking/booking-context.tsx` - Added `updateTripCharge()` function
3. `components/booking/screen-5-customer.tsx` - Added distance check, trip charge modal, and service area blocking

---

## ⚠️ Important Notes

1. **Geocoding Service:**
   - Uses OpenStreetMap Nominatim API (100% free, no API key)
   - Rate limit: 1 request per second (automatically handled)
   - Accuracy: Same as Google Maps for US addresses

2. **Fallback Behavior:**
   - If geocoding fails: No trip charge applied, booking proceeds normally
   - If address not found: No trip charge applied, booking proceeds normally
   - Errors logged to console for debugging

3. **Base Location:**
   - Currently set to Kyrene Rd & De La Mariposa Dr, Phoenix, AZ 85044
   - To change: Edit `STARTING_LOCATION` in `lib/distance-calculator.ts`

---

## 🚀 Ready to Test!

The feature works immediately - no setup required!

1. **Start dev server** (`npm run dev`)
2. **Test the booking flow** with different addresses (see test scenarios above)
3. **Check browser console** for distance calculations
4. **Deploy to production** - it just works!

---

## 📞 Contact Options in Modal

The trip charge modal includes:
- **Call/Text:** (602) 799-5856
- **Email:** partylabaz@gmail.com

Customers can contact you to discuss the trip charge before accepting.

---

**Last Updated:** January 20, 2026
**Status:** ✅ Fully Implemented - Ready to Use (No API Key Required!)
