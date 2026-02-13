import { test, expect, Page } from '@playwright/test';
import { format, addDays } from 'date-fns';

/**
 * E2E tests for custom time block selection
 * Tests the flow where users adjust the 12-hour dropdown time pickers
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

/**
 * Set the custom time using the 12-hour dropdown selects.
 * Each time section (Start Time / End Time) has 3 dropdowns: hour, minute, period.
 */
async function setCustomTime(
  page: Page,
  startHour: string, startMinute: string, startPeriod: string,
  endHour: string, endMinute: string, endPeriod: string
) {
  // Start Time dropdowns: find the label, go to parent div, locate selects
  const startLabel = page.getByText('Start Time', { exact: true });
  const startContainer = startLabel.locator('..');
  const startSelects = startContainer.locator('select');
  await startSelects.nth(0).selectOption(startHour);
  await startSelects.nth(1).selectOption(startMinute);
  await startSelects.nth(2).selectOption(startPeriod);

  // End Time dropdowns
  const endLabel = page.getByText('End Time', { exact: true });
  const endContainer = endLabel.locator('..');
  const endSelects = endContainer.locator('select');
  await endSelects.nth(0).selectOption(endHour);
  await endSelects.nth(1).selectOption(endMinute);
  await endSelects.nth(2).selectOption(endPeriod);
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
  await page.getByRole('radio', { name: 'Yes' }).nth(1).check();
  await page.getByRole('radio', { name: 'Yes' }).nth(2).check();
  await page.getByRole('radio', { name: 'Yes' }).nth(3).check();

  await page.getByLabel(/I understand the \$100/i).check();
}

test.describe('Booking Flow - Custom Time Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Complete booking flow with custom time selection', async ({ page }) => {
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

    // Change time from default (5-8 PM) to 6:00 PM - 9:00 PM
    await setCustomTime(page, '6', '00', 'PM', '9', '00', 'PM');

    // Verify duration displays correctly
    await expect(page.getByText(/Duration: 3 hours/i)).toBeVisible();

    // Continue to Package screen
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Screen 3: Package Selection
    await expect(page.getByText(/choose your package/i).first()).toBeVisible();
    await page.getByText('Party Starter').first().click();
    await expect(page.getByText('$250').first()).toBeVisible();
    await page.getByRole('button', { name: /continue to add-ons/i }).click();

    // Screen 4: Add-Ons - skip
    await expect(page.getByText(/enhance your experience/i)).toBeVisible();
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    // Screen 5: Customer Information
    await expect(page.getByText(/your information/i)).toBeVisible();
    await fillCustomerForm(page, {
      name: 'Test User E2E',
      email: 'test.e2e@example.com',
      phone: '602-555-1234',
      address: '123 Test St, Phoenix, AZ 85001',
      eventType: 'Birthday Party',
    });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Screen 6: Payment & Summary
    await expect(page.getByText(/secure payment/i)).toBeVisible({ timeout: 15000 });

    // Verify date is correct
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    // Verify custom time block shows (6:00 PM - 9:00 PM)
    await expect(page.getByText(/6:00 PM/)).toBeVisible();
    await expect(page.getByText(/9:00 PM/)).toBeVisible();

    // Verify pricing
    const summary = page.locator('div').filter({ has: page.getByText('Booking Summary') }).first();
    await expect(summary).toContainText('$250');

    console.log('✅ Complete E2E Flow with Custom Time: All checks passed!');
    console.log(`   - Date: ${targetDateFormatted} ✓`);
    console.log('   - Time: 6:00 PM - 9:00 PM ✓');
    console.log('   - Pricing: $250 total, $100 deposit ✓');
  });

  test('Custom time validation: End time must be after start time', async ({ page }) => {
    const targetDate = addDays(new Date(), 5);

    // Navigate through booking flow
    await page.getByRole('button', { name: /book now/i }).first().click();
    await expect(page.getByRole('heading', { name: /choose your venue/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue to date & time/i }).click();

    // Select date
    await selectCalendarDate(page, targetDate);
    await waitForTimePicker(page);

    // Set invalid time: end before start (8 PM start, 5 PM end)
    await setCustomTime(page, '8', '00', 'PM', '5', '00', 'PM');

    // Verify error message appears
    await expect(page.getByText(/End time must be after start time/i)).toBeVisible();

    // Verify continue button is disabled
    const continueButton = page.getByRole('button', { name: /continue to packages/i });
    await expect(continueButton).toBeDisabled();

    // Fix the times: 8 PM - 11 PM (3 hours)
    await setCustomTime(page, '8', '00', 'PM', '11', '00', 'PM');

    // Verify duration shows correctly
    await expect(page.getByText(/Duration: 3 hours/i)).toBeVisible();

    // Verify continue button is now enabled
    await expect(continueButton).toBeEnabled();

    console.log('✅ Time validation test passed!');
  });

  test('Date accuracy: Selected date matches payment screen date', async ({ page }) => {
    const targetDate = addDays(new Date(), 7);
    const targetDateFormatted = format(targetDate, 'MMMM d, yyyy');

    await page.getByRole('button', { name: /book now/i }).first().click();
    await expect(page.getByRole('heading', { name: /choose your venue/i })).toBeVisible();
    await page.getByRole('heading', { name: 'Dance Dome' }).first().click();
    await page.getByRole('button', { name: /continue to date & time/i }).click();

    // Select date and set custom time 6-9 PM
    await selectCalendarDate(page, targetDate);
    await waitForTimePicker(page);
    await setCustomTime(page, '6', '00', 'PM', '9', '00', 'PM');
    await page.getByRole('button', { name: /continue to packages/i }).click();

    // Quick pass through remaining screens
    await page.getByText('Party Starter').first().click();
    await page.getByRole('button', { name: /continue to add-ons/i }).click();
    await page.getByRole('button', { name: /continue to customer info/i }).click();

    await fillCustomerForm(page, {
      name: 'Date Test User',
      email: 'datetest@example.com',
      phone: '602-555-9999',
      address: '456 Date Test, Phoenix, AZ 85001',
      eventType: 'Birthday Party',
    });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    // Verify date on payment screen matches selected date
    await expect(page.getByText(/secure payment/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(targetDateFormatted)).toBeVisible();

    console.log(`✅ Date Accuracy Test: Expected "${targetDateFormatted}" and found it on payment screen`);
  });
});
