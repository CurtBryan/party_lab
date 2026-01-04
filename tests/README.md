# The Partylab - Automated E2E Tests

This directory contains Playwright end-to-end tests for the booking flow, specifically testing the critical bug fixes.

## What's Being Tested

### 1. Date Display Bug Fix
Tests that when a user selects a date (e.g., February 7), the payment summary screen shows the correct date (February 7, not February 6).

### 2. Pricing Calculation Bug Fix
Tests that Dance Dome Party Starter package shows $250 total (not $350):
- Subtotal: $250
- Deposit (Due Now): $100
- Total: $250
- Remaining Balance: $150

### 3. "Deposit" Terminology
Tests that all user-facing text uses "deposit" instead of "booking fee" throughout the entire booking flow.

### 4. Complete E2E Happy Path
Tests the entire booking flow from start to payment screen with all fixes applied.

## Running Tests

### Run all tests (headless mode):
```bash
npm test
```

### Run tests with UI (interactive mode):
```bash
npm run test:ui
```

### Run tests with browser visible:
```bash
npm run test:headed
```

### Debug tests step-by-step:
```bash
npm run test:debug
```

### View test report:
```bash
npm run test:report
```

### Run specific test file:
```bash
npx playwright test tests/booking-flow.spec.ts
```

### Run only one test:
```bash
npx playwright test -g "Date Display Fix"
```

## Test Configuration

Tests are configured in `playwright.config.ts` and run on:
- ✅ Desktop Chrome (Chromium)
- ✅ Desktop Firefox
- ✅ Desktop Safari (WebKit)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## CI/CD Integration

To run tests in GitHub Actions, add this to `.github/workflows/test.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
      env:
        STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        WEB3FORMS_ACCESS_KEY: ${{ secrets.WEB3FORMS_ACCESS_KEY }}
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
        SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Test Structure

Each test follows this pattern:
1. Navigate to homepage
2. Click "Book Now" to open booking modal
3. Go through each screen of the booking flow
4. Verify the specific fix is working
5. Assert expected vs actual values

## Troubleshooting

### Tests fail with "Element not found"
- Make sure the dev server is running on `http://localhost:3000`
- Check that element selectors match your actual UI

### Tests timeout
- Increase timeout in `playwright.config.ts`
- Check that your dev server starts within 120 seconds

### Date selection fails
- Ensure dates are at least 48 hours in the future (booking minimum)
- Check calendar component is rendering correctly

## Maintenance

When updating the booking flow UI:
1. Update test selectors if element text/structure changes
2. Add new tests for new features
3. Run `npm test` before committing changes

## Questions?

See [Playwright Documentation](https://playwright.dev) for more details on writing and debugging tests.
