import { test, expect } from '@playwright/test';
import { format, addDays } from 'date-fns';

/**
 * Updated E2E tests for custom time block selection
 * Tests the new flow where users choose their own start/end times
 */

test.describe('Booking Flow - Custom Time Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Complete booking flow with custom time selection', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');
    const targetDay = targetDate.getDate();

    // Start booking
    await page.getByRole('button', { name: /book now/i }).first().click();

    // Screen 1: Product Selection
    await expect(page.getByRole('heading', { name: /choose your product/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Screen 2: Date & Time
    await expect(page.getByText(/pick your date/i)).toBeVisible();
    await page.waitForTimeout(1000);

    // Click the target date
    const dateButton = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton.click();

    // Wait for time picker to auto-open
    await page.waitForTimeout(500);

    // Verify "Choose Your Time Block" button is visible
    await expect(page.getByText('Choose Your Time Block')).toBeVisible();

    // Fill in custom start time (5:00 PM)
    await page.locator('#startTime').fill('17:00');

    // Fill in custom end time (8:00 PM)
    await page.locator('#endTime').fill('20:00');

    // Verify duration is calculated
    await expect(page.getByText(/Duration: 3 hours/i)).toBeVisible();

    // Continue to Package screen
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3: Package Selection
    await expect(page.getByText(/choose your package/i).first()).toBeVisible();
    await page.getByText('Party Starter').first().click();
    await expect(page.getByText('$250').first()).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();

    // Screen 4: Add-Ons
    await expect(page.getByText(/enhance your experience/i)).toBeVisible();
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Customer Information
    await expect(page.getByText(/your information/i)).toBeVisible();
    await page.getByLabel(/full name/i).fill('Test User E2E');
    await page.getByLabel(/email/i).fill('test.e2e@example.com');
    await page.getByLabel(/phone/i).fill('602-555-1234');
    await page.getByLabel(/event address/i).fill('123 Test St, Phoenix, AZ 85001');
    await page.locator('select#eventType').first().selectOption('Birthday Party');

    // Fill Pre-Event Readiness Checklist
    await page.getByLabel('Yes', { exact: true }).first().check();
    await page.locator('select#surfaceType').first().selectOption('Grass / Turf (flat, even, free of rocks or sticks)');
    await page.getByRole('radio', { name: 'Yes' }).nth(1).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(2).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(3).check();

    await page.getByLabel(/I understand the \$100/i).check();
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Payment & Summary
    await expect(page.getByText(/secure payment/i)).toBeVisible();

    // CRITICAL TESTS:
    // 1. Date is correct
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    // 2. Time block shows custom time (17:00-20:00)
    await expect(page.getByText(/5:00 PM.*8:00 PM/i)).toBeVisible();

    // 3. Pricing is correct
    await expect(page.getByText(/Subtotal/i).locator('..').first()).toContainText('$250');
    await expect(page.getByText(/Deposit \(Due Now\)/i).locator('..').first()).toContainText('$100');

    console.log('✅ Complete E2E Flow with Custom Time: All checks passed!');
    console.log(`   - Date: ${targetDateFormatted} ✓`);
    console.log('   - Time: 17:00-20:00 (5:00 PM - 8:00 PM) ✓');
    console.log('   - Pricing: $250 total, $100 deposit ✓');
  });

  test('Custom time validation: End time must be after start time', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);
    const targetDay = targetDate.getDate();

    // Navigate through booking flow
    await page.getByRole('button', { name: /book now/i }).first().click();
    await expect(page.getByRole('heading', { name: /choose your product/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Select date
    await page.waitForTimeout(1000);
    const dateButton = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton.click();
    await page.waitForTimeout(500);

    // Try invalid time (end before start)
    await page.locator('#startTime').fill('20:00');
    await page.locator('#endTime').fill('17:00');

    // Verify error message appears
    await expect(page.getByText(/End time must be after start time/i)).toBeVisible();

    // Verify continue button is disabled
    const continueButton = page.getByRole('button', { name: /continue to packages/i });
    await expect(continueButton).toBeDisabled();

    // Fix the times
    await page.locator('#endTime').fill('23:00');

    // Verify duration calculation shows
    await expect(page.getByText(/Duration: 3 hours/i)).toBeVisible();

    // Verify continue button is now enabled
    await expect(continueButton).toBeEnabled();

    console.log('✅ Time validation test passed!');
  });

  test('Date accuracy: Selected date matches payment screen date', async ({ page }) => {
    const targetDate = addDays(new Date(), 7);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');
    const targetDay = targetDate.getDate();

    await page.getByRole('button', { name: /book now/i }).first().click();
    await expect(page.getByRole('heading', { name: /choose your product/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue/i }).click();

    await page.waitForTimeout(1000);
    const dateButton = page.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
    await dateButton.click();

    // Fill in time
    await page.locator('#startTime').fill('18:00');
    await page.locator('#endTime').fill('21:00');

    await page.getByRole('button', { name: /continue to packages/i }).click();
    await page.getByText('Party Starter').first().click();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Fill customer info quickly
    await page.getByLabel(/full name/i).fill('Date Test User');
    await page.getByLabel(/email/i).fill('datetest@example.com');
    await page.getByLabel(/phone/i).fill('602-555-9999');
    await page.getByLabel(/event address/i).fill('456 Date Test, Phoenix, AZ');
    await page.locator('select#eventType').first().selectOption('Birthday Party');

    await page.getByLabel('Yes', { exact: true }).first().check();
    await page.locator('select#surfaceType').first().selectOption('Concrete / Asphalt / Driveway (smooth, level, free of debris)');
    await page.getByRole('radio', { name: 'Yes' }).nth(1).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(2).check();
    await page.getByRole('radio', { name: 'Yes' }).nth(3).check();

    await page.getByLabel(/I understand the \$100/i).check();
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // CRITICAL: Verify date on payment screen matches selected date
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    console.log(`✅ Date Accuracy Test: Expected "${targetDateFormatted}" and found it on payment screen`);
  });
});
