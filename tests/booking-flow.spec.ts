import { test, expect, Page } from '@playwright/test';
import { format, addDays } from 'date-fns';

/**
 * Automated E2E tests for The Partylab booking flow
 * Tests critical functionality:
 * 1. Date display accuracy (correct date on payment screen)
 * 2. Pricing calculation (Dance Dome Party Starter = $250)
 * 3. "Deposit" terminology throughout the flow
 * 4. Complete E2E happy path
 */

/** Navigate the DayPicker calendar to the target month and click the day */
async function selectCalendarDate(page: Page, targetDate: Date) {
  const targetDay = targetDate.getDate();
  const targetMonthYear = format(targetDate, 'MMMM yyyy');

  await page.waitForTimeout(1000);

  // Navigate forward until the target month is displayed (up to 6 clicks)
  for (let i = 0; i < 6; i++) {
    const monthVisible = await page.getByText(targetMonthYear).first().isVisible();
    if (monthVisible) break;
    // react-day-picker v9 uses chevron buttons for navigation - click next (right) arrow
    const nextButton = page.locator('button').filter({ has: page.locator('svg[class*="chevron"]') }).last();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(300);
    }
  }

  // Click the target day in the calendar
  // The DayPicker renders days as buttons inside a table; find by exact text match
  await page.locator('table button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first().click();
}

/** Wait for the availability check to finish and the time picker to appear */
async function waitForTimePicker(page: Page) {
  await expect(page.getByText('Start Time')).toBeVisible({ timeout: 10000 });
}

/** Fill the customer info form on Screen 5 */
async function fillCustomerForm(page: Page, data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  eventType: string;
}) {
  await page.getByLabel(/full name/i).fill(data.name);
  await page.getByLabel(/email/i).fill(data.email);
  await page.getByLabel(/phone/i).fill(data.phone);
  await page.getByLabel(/event address/i).fill(data.address);
  await page.locator('select#eventType').first().selectOption(data.eventType);

  // Pre-Event Readiness Checklist
  await page.getByLabel('Yes', { exact: true }).first().check();
  await page.locator('select#surfaceType').first().selectOption('Grass / Turf (flat, even, free of rocks or sticks)');
  await page.getByRole('radio', { name: 'Yes' }).nth(1).check(); // Power Source
  await page.getByRole('radio', { name: 'Yes' }).nth(2).check(); // Wi-Fi/Music
  await page.getByRole('radio', { name: 'Yes' }).nth(3).check(); // Access Path

  // Agree to terms
  await page.getByLabel(/I understand the \$100/i).check();
}

test.describe('Booking Flow - Critical Bug Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Date Display Fix: Selected date should match summary date', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');

    // Start booking
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Screen 1: Product Selection
    await expect(page.getByRole('heading', { name: /choose your venue/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue to date & time/i }).click();

    // Screen 2: Date & Time
    await expect(page.getByText(/pick your date/i)).toBeVisible();
    await selectCalendarDate(page, targetDate);
    await waitForTimePicker(page);
    // Default time (5:00 PM - 8:00 PM) is already set and valid
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3: Package Selection
    await page.getByText('Party Starter').first().click();
    await page.getByRole('button', { name: /continue to add-ons/i }).click();

    // Screen 4: Skip add-ons
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Customer Information
    await fillCustomerForm(page, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '602-555-1234',
      address: '123 Test St, Phoenix, AZ 85001',
      eventType: 'Birthday Party',
    });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Payment - verify the date matches
    await expect(page.getByText(/secure payment/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    console.log(`✅ Date Display Test: Expected "${targetDateFormatted}" and found it on payment screen`);
  });

  test('Pricing Fix: Dance Dome Party Starter should be $250 total, not $350', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);

    // Start booking
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Screen 1: Select Dance Dome
    await expect(page.getByRole('heading', { name: /choose your venue/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue to date & time/i }).click();

    // Screen 2: Select date and time
    await selectCalendarDate(page, targetDate);
    await waitForTimePicker(page);
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3: Select Party Starter
    await page.getByText('Party Starter').first().click();
    await expect(page.getByText('$250').first()).toBeVisible();
    await page.getByRole('button', { name: /continue to add-ons/i }).click();

    // Screen 4: Verify subtotal is $250
    await expect(page.getByText(/subtotal/i).locator('..').first()).toContainText('$250');
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Fill customer info
    await fillCustomerForm(page, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '602-555-1234',
      address: '123 Test St, Phoenix, AZ 85001',
      eventType: 'Birthday Party',
    });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Verify pricing
    await expect(page.getByText(/secure payment/i)).toBeVisible({ timeout: 15000 });

    // Get the booking summary card and verify pricing within it
    const summary = page.locator('div').filter({ has: page.getByText('Booking Summary') }).first();
    await expect(summary).toContainText('$250');

    // Verify the header shows $100 deposit (Stripe payment button may not load without API key)
    await expect(page.getByText(/\$100 deposit/i)).toBeVisible();

    console.log('✅ Pricing Test: Verified $250 total, $100 deposit');
  });

  test('Deposit Terminology: Should say "deposit" not "booking fee" throughout flow', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);

    // Start booking
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Screen 1
    await expect(page.getByRole('heading', { name: /choose your venue/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue to date & time/i }).click();

    // Screen 2
    await selectCalendarDate(page, targetDate);
    await waitForTimePicker(page);
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3
    await page.getByText('Party Starter').first().click();
    await page.getByRole('button', { name: /continue to add-ons/i }).click();

    // Screen 4: Check deposit terminology
    await expect(page.getByText(/\$100 deposit will be charged now/i)).toBeVisible();
    console.log('✅ Add-ons screen: Uses "deposit" terminology');

    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Check terms checkbox uses "deposit"
    await expect(page.getByText(/I understand the \$100 deposit is non-refundable/i)).toBeVisible();
    console.log('✅ Customer info screen: Uses "deposit" terminology');

    await fillCustomerForm(page, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '602-555-1234',
      address: '123 Test St, Phoenix, AZ 85001',
      eventType: 'Birthday Party',
    });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Check deposit terminology
    await expect(page.getByText(/secure payment/i)).toBeVisible({ timeout: 15000 });
    // Header shows "Complete your booking with a secure $100 deposit"
    await expect(page.getByText(/\$100 deposit/i)).toBeVisible();
    console.log('✅ Payment screen: Uses "deposit" terminology');

    // Verify NO instances of "booking fee" appear
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).not.toContain('booking fee');
    console.log('✅ No instances of "booking fee" found on page');
  });

  test('Complete Booking Flow: End-to-End happy path with add-on', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');

    // Start booking
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Screen 1: Product Selection
    await expect(page.getByRole('heading', { name: /choose your venue/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue to date & time/i }).click();

    // Screen 2: Date & Time
    await expect(page.getByText(/pick your date/i)).toBeVisible();
    await selectCalendarDate(page, targetDate);
    await waitForTimePicker(page);
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3: Package Selection
    await expect(page.getByText(/choose your package/i).first()).toBeVisible();
    await page.getByText('Party Starter').first().click();
    await expect(page.getByText('$250').first()).toBeVisible();
    await page.getByRole('button', { name: /continue to add-ons/i }).click();

    // Screen 4: Add-Ons - add Extra Hour ($50)
    await expect(page.getByText(/enhance your experience/i)).toBeVisible();
    await expect(page.getByText(/\$100 deposit will be charged/i)).toBeVisible();
    await page.getByText('Extra Hour').first().click();
    // $250 base + $50 Extra Hour = $300
    await expect(page.getByText('$300').first()).toBeVisible();
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Customer Information
    await expect(page.getByText(/your information/i)).toBeVisible();
    await fillCustomerForm(page, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '602-555-9876',
      address: '456 Party Lane, Phoenix, AZ 85001',
      eventType: 'Birthday Party',
    });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Payment & Summary - verify all fixes
    await expect(page.getByText(/secure payment/i)).toBeVisible({ timeout: 15000 });

    // 1. Date is correct
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    // 2. Pricing is correct ($300 = $250 base + $50 Extra Hour add-on)
    const summary = page.locator('div').filter({ has: page.getByText('Booking Summary') }).first();
    await expect(summary).toContainText('$300');
    await expect(summary).toContainText('Party Starter');

    // 3. Uses "deposit" terminology, header shows $100 deposit
    await expect(page.getByText(/\$100 deposit/i)).toBeVisible();

    console.log('✅ Complete E2E Flow: All fixes verified!');
    console.log(`   - Date: ${targetDateFormatted} ✓`);
    console.log('   - Pricing: $300 total ($250 + $50 add-on), $100 deposit ✓');
    console.log('   - Terminology: "deposit" used throughout ✓');
  });
});
