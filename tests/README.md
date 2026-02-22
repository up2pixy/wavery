# Playwright UI Tests for Wavery App

This directory contains end-to-end UI tests for the Wavery App using Playwright.

## Test Coverage

The test suite includes comprehensive tests for:

### Core Functionality
- **App Rendering**: Verifies the app loads correctly with title and header
- **SVG Canvas**: Tests that the SVG is rendered with proper dimensions
- **Control Panel**: Validates all accordion sections are present

### Dimension Controls
- Width input field functionality
- Height input field functionality
- Value persistence and updates

### Wave Settings
- Segment count slider
- Layer count slider
- Variance slider
- Accordion expand/collapse behavior

### Stroke Settings
- Stroke width controls
- Stroke color picker
- Accordion expand/collapse behavior

### Gradient Colors
- Color picker inputs
- Add color functionality
- Remove color functionality
- Position sliders

### Action Buttons
- Regenerate button functionality
- Reset button functionality
- Download buttons (SVG and PNG)

### Layout
- Responsive layout verification
- Canvas and control panel visibility

## Running Tests

### Prerequisites
```bash
# Install dependencies (if not already installed)
npm install

# Install Playwright browsers (first time only)
npx playwright install
npx playwright install-deps
```

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### View Test Report
```bash
npm run test:report
```

### Run Tests for Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Specific Test File
```bash
npx playwright test tests/wavery-app.spec.ts
```

### Debug Tests
```bash
npx playwright test --debug
```

## Test Configuration

The tests are configured in `playwright.config.ts` with the following settings:

- **Browsers**: Chromium, Firefox, and WebKit
- **Base URL**: http://localhost:3000
- **Retries**: 2 retries on CI, 0 locally
- **Web Server**: Automatically builds and serves the app before running tests
- **Reporter**: HTML report with trace on first retry

## Test Structure

Tests follow Playwright best practices:
- Each test is independent and can run in isolation
- Tests use `beforeEach` to navigate to the app
- Tests use accessible locators (getByRole, getByText, getByLabel)
- Tests wait for elements to be visible before interacting
- Tests include appropriate timeouts for async operations

## CI/CD Integration

The tests are designed to run in CI/CD pipelines:
- Tests run in parallel where possible
- Failed tests include traces and screenshots
- Tests automatically build the app before running
- Tests use a dedicated http-server for serving the built app

## Troubleshooting

### Tests Timeout
If tests timeout, increase the timeout in the test or check if the app is building correctly:
```bash
npm run build
```

### Port Already in Use
If port 3000 is in use, either stop the process or change the port in `playwright.config.ts`.

### Browser Not Installed
Run the installation command:
```bash
npx playwright install
```

### System Dependencies Missing
Install system dependencies:
```bash
npx playwright install-deps
```

## Adding New Tests

When adding new tests:
1. Follow the existing test structure
2. Use descriptive test names
3. Use accessible selectors when possible
4. Add appropriate waits for async operations
5. Ensure tests are independent and don't rely on test order
6. Run the full test suite to ensure no regressions

## Test Results

All 45 tests pass across 3 browsers (Chromium, Firefox, and WebKit):
- 15 tests per browser
- Total test execution time: ~2-3 minutes
- 100% pass rate
