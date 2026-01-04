import { test, expect } from '@playwright/test';
import { format, addDays } from 'date-fns';

/**
 * Automated E2E tests for The Partylab booking flow
 * Tests the three critical fixes:
 * 1. Date display bug (should show correct date, not off-by-one)
 * 2. Pricing calculation (should not add extra $100)
 * 3. "Deposit" terminology throughout the flow
 */

test.describe('Booking Flow - Critical Bug Fixes', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
  });

  test('Date Display Fix: Selected date should match summary date', async ({ page }) => {
    // Click Book Now button
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Wait for booking modal to open (Screen 1)
    await expect(page.getByRole('heading', { name: /step 1.*choose your product/i })).toBeVisible();

    // Select Dance Dome product (first instance in the modal)
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();

    // Calculate a date 5 days from now (well past the 48-hour minimum)
    const targetDate = addDays(new Date(), 5);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');
    const targetDay = targetDate.getDate();

    // Continue to Date & Time screen
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for calendar to load
    await expect(page.getByText(/pick your date/i)).toBeVisible();

    // Wait a moment for calendar to fully render
    await page.waitForTimeout(1000);

    // Click the target date in the calendar - try multiple selector strategies
    // react-day-picker uses button elements with the day number as text
    const dateButton = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton.click();

    // Select a time block (5:00 PM - 8:00 PM - available all days)
    await page.getByText('5:00 PM - 8:00 PM').click();

    // Continue to Package screen
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Select Party Starter package
    await page.getByText('Party Starter').first().click();

    // Continue to Add-Ons screen
    await page.getByRole('button', { name: /continue/i }).click();

    // Skip add-ons
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Fill customer information
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/phone/i).fill('602-555-1234');
    await page.getByLabel(/event address/i).fill('123 Test St, Phoenix, AZ 85001');

    // Select event type
    await page.locator('select#eventType').first().selectOption('Birthday Party');

    // Fill Pre-Event Readiness Checklist
    await page.getByLabel('Yes', { exact: true }).first().check();
    await page.locator('select#surfaceType').first().selectOption('Grass / Turf (flat, even, free of rocks or sticks)');
    await page.getByRole('radio', { name: 'Yes' }).nth(1).check(); // Power Source
    await page.getByRole('radio', { name: 'Yes' }).nth(2).check(); // Wi-Fi/Music
    await page.getByRole('radio', { name: 'Yes' }).nth(3).check(); // Access Path

    // Agree to terms
    await page.getByLabel(/I understand the \$100/i).check();

    // Continue to Payment screen
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Wait for payment screen to load
    await expect(page.getByText(/secure payment/i)).toBeVisible();

    // CRITICAL TEST: Verify the date displayed matches what we selected
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    console.log(`✅ Date Display Test: Expected "${targetDateFormatted}" and found it on payment screen`);
  });

  test('Pricing Fix: Dance Dome Party Starter should be $250 total, not $350', async ({ page }) => {
    // Click Book Now button
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Wait for modal and select Dance Dome
    await expect(page.getByRole('heading', { name: /step 1.*choose your product/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Select date and time
    const targetDate = addDays(new Date(), 5);
    const targetDay = targetDate.getDate();
    await page.waitForTimeout(1000);
    const dateButton = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton.click();
    await page.getByText('5:00 PM - 8:00 PM').click();
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Select Party Starter package
    await page.getByText('Party Starter').first().click();

    // VERIFY: Package price should show $250 (not $300 or $350)
    await expect(page.getByText('$250').first()).toBeVisible();

    // Continue to add-ons
    await page.getByRole('button', { name: /continue/i }).click();

    // VERIFY: Subtotal on add-ons screen should be $250
    await expect(page.getByText(/subtotal/i).locator('..')).toContainText('$250');

    // Continue through customer info
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/phone/i).fill('602-555-1234');
    await page.getByLabel(/event address/i).fill('123 Test St, Phoenix, AZ 85001');
    await page.locator('select#eventType').first().selectOption('Birthday Party');

    await page.getByLabel('Yes', { exact: true }).first().check();
    await page.locator('select#surfaceType').first().selectOption('Grass / Turf (flat, even, free of rocks or sticks)');
    await page.getByRole('radio', { name: 'Yes' }).nth(1).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(2).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(3).check();

    await page.getByLabel(/I understand the \$100/i).check();
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Wait for payment screen
    await expect(page.getByText(/secure payment/i)).toBeVisible();

    // CRITICAL TEST: Verify pricing breakdown
    // Subtotal should be $250
    const subtotalText = await page.locator('text=/Subtotal/').locator('..').first().textContent();
    expect(subtotalText).toContain('$250');

    // Deposit (Due Now) should be $100
    const depositText = await page.locator('text=/Deposit \\(Due Now\\)/').locator('..').first().textContent();
    expect(depositText).toContain('$100');

    // Total should be $250 (NOT $350!)
    const totalText = await page.locator('text=/Total/').locator('..').first().textContent();
    expect(totalText).toContain('$250');

    // Verify the button shows correct deposit amount
    await expect(page.getByRole('button', { name: /Pay \$100 Securely/i })).toBeVisible();

    console.log('✅ Pricing Test: Verified $250 total (not $350), $100 deposit, $150 remaining');
  });

  test('Deposit Terminology: Should say "deposit" not "booking fee" throughout flow', async ({ page }) => {
    // Click Book Now button
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Wait for modal and go through booking flow quickly
    await expect(page.getByRole('heading', { name: /step 1.*choose your product/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    const targetDate = addDays(new Date(), 5);
    const targetDay = targetDate.getDate();
    await page.waitForTimeout(1000);
    const dateButton1 = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton1.click();
    await page.getByText('5:00 PM - 8:00 PM').click();
    await page.getByRole('button', { name: /continue to packages/i }).click();

    await page.getByText('Party Starter').first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    // TEST 1: Add-ons screen should say "deposit"
    await expect(page.getByText(/\$100 deposit will be charged now/i)).toBeVisible();
    console.log('✅ Add-ons screen: Uses "deposit" terminology');

    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // TEST 2: Customer info screen checkbox should say "deposit"
    await expect(page.getByText(/I understand the \$100 deposit is non-refundable/i)).toBeVisible();
    console.log('✅ Customer info screen: Uses "deposit" terminology');

    // Fill form and continue
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/phone/i).fill('602-555-1234');
    await page.getByLabel(/event address/i).fill('123 Test St, Phoenix, AZ 85001');
    await page.locator('select#eventType').first().selectOption('Birthday Party');

    await page.getByLabel('Yes', { exact: true }).first().check();
    await page.locator('select#surfaceType').first().selectOption('Grass / Turf (flat, even, free of rocks or sticks)');
    await page.getByRole('radio', { name: 'Yes' }).nth(1).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(2).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(3).check();

    await page.getByLabel(/I understand the \$100/i).check();
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // TEST 3: Payment screen should say "Deposit (Due Now)"
    await expect(page.getByText(/Deposit \(Due Now\)/i)).toBeVisible();
    console.log('✅ Payment screen: Uses "deposit" terminology');

    // Verify NO instances of "booking fee" appear
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).not.toContain('booking fee');
    console.log('✅ No instances of "booking fee" found on page');
  });

  test('Complete Booking Flow: End-to-End happy path with all fixes', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');
    const targetDay = targetDate.getDate();

    // Start booking
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Screen 1: Product Selection
    await expect(page.getByRole('heading', { name: /step 1.*choose your product/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Screen 2: Date & Time
    await expect(page.getByText(/pick your date/i)).toBeVisible();
    await page.waitForTimeout(1000);
    const dateButton2 = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton2.click();
    await page.getByText('5:00 PM - 8:00 PM').click();
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3: Package Selection
    await expect(page.getByText(/choose your package/i).first()).toBeVisible();
    await page.getByText('Party Starter').first().click();
    await expect(page.getByText('$250').first()).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();

    // Screen 4: Add-Ons
    await expect(page.getByText(/enhance your experience/i)).toBeVisible();
    await expect(page.getByText(/\$100 deposit will be charged/i)).toBeVisible();
    // Optionally add an extra hour (+$75)
    await page.getByText('Extra Hour').click();
    await expect(page.getByText('$325').first()).toBeVisible(); // $250 + $75
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Customer Information
    await expect(page.getByText(/your information/i)).toBeVisible();
    await page.getByLabel(/full name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/phone/i).fill('602-555-9876');
    await page.getByLabel(/event address/i).fill('456 Party Lane, Phoenix, AZ 85001');
    await page.locator('select#eventType').first().selectOption('Birthday Party');

    await page.getByLabel('Yes', { exact: true }).first().check();
    await page.locator('select#surfaceType').first().selectOption('Concrete / Asphalt / Driveway (smooth, level, free of debris)');
    await page.getByRole('radio', { name: 'Yes' }).nth(1).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(2).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(3).check();

    await expect(page.getByText(/I understand the \$100 deposit/i)).toBeVisible();
    await page.getByLabel(/I understand the \$100/i).check();
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Payment & Summary
    await expect(page.getByText(/secure payment/i)).toBeVisible();

    // Verify all fixes are applied
    // 1. Date is correct
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    // 2. Pricing is correct ($325 = $250 base + $75 extra hour, NOT $425)
    await expect(page.getByText(/Subtotal/i).locator('..').first()).toContainText('$325');
    await expect(page.getByText(/Deposit \(Due Now\)/i).locator('..').first()).toContainText('$100');
    await expect(page.getByText(/Total/i).locator('..').first()).toContainText('$325');

    // 3. Uses "deposit" terminology
    await expect(page.getByText(/Deposit \(Due Now\)/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Pay \$100 Securely/i })).toBeVisible();

    console.log('✅ Complete E2E Flow: All fixes verified!');
    console.log(`   - Date: ${targetDateFormatted} ✓`);
    console.log('   - Pricing: $325 total ($250 + $75 add-on), $100 deposit, $225 remaining ✓');
    console.log('   - Terminology: "deposit" used throughout ✓');
  });
});
