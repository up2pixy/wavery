import { test, expect } from '@playwright/test';

test.describe('Wavery App UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('should display app title and header', async ({ page }) => {
    // Check that the page loads correctly
    await expect(page).toHaveTitle(/Wavery Generator/);

    // Check for the app title in the header
    await expect(page.getByRole('heading', { name: /Wavery Generator/i })).toBeVisible();

    // Check for the tagline
    await expect(page.getByText(/Create beautiful wave backgrounds/i)).toBeVisible();
  });

  test('should render SVG canvas', async ({ page }) => {
    // Wait for SVG to be rendered
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check that SVG has reasonable dimensions
    const svgBox = await svg.boundingBox();
    expect(svgBox).not.toBeNull();
    expect(svgBox!.width).toBeGreaterThan(0);
    expect(svgBox!.height).toBeGreaterThan(0);
  });

  test('should have control panel with accordions', async ({ page }) => {
    // Check for all accordion sections
    await expect(page.getByText(/Dimensions/i)).toBeVisible();
    await expect(page.getByText(/Wave Settings/i)).toBeVisible();
    await expect(page.getByText(/Stroke Settings/i)).toBeVisible();
    await expect(page.getByText(/Gradient Colors/i)).toBeVisible();
    await expect(page.getByText('Color Presets')).toBeVisible();
  });

  test('should allow changing width dimension', async ({ page }) => {
    // Dimensions accordion is expanded by default — no click needed
    const widthInput = page.getByLabel(/Width/i).first();
    await expect(widthInput).toBeVisible();

    // Change the width value
    await widthInput.fill('1000');
    await widthInput.blur();

    // Wait a bit for the SVG to regenerate
    await page.waitForTimeout(500);

    // Verify the value was updated
    await expect(widthInput).toHaveValue('1000');
  });

  test('should allow changing height dimension', async ({ page }) => {
    // Dimensions accordion is expanded by default — no click needed
    const heightInput = page.getByLabel(/Height/i).first();
    await expect(heightInput).toBeVisible();

    // Change the height value
    await heightInput.fill('700');
    await heightInput.blur();

    // Wait a bit for the SVG to regenerate
    await page.waitForTimeout(500);

    // Verify the value was updated
    await expect(heightInput).toHaveValue('700');
  });

  test('should have regenerate button', async ({ page }) => {
    const regenerateButton = page.getByRole('button', { name: /regenerate/i });
    await expect(regenerateButton).toBeVisible();

    // Click the regenerate button
    await regenerateButton.click();

    // Wait for SVG to update
    await page.waitForTimeout(300);

    // SVG should still be visible
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should have reset button and restore defaults', async ({ page }) => {
    // The reset button is an icon-only button with tooltip "Reset to defaults"
    const resetButton = page.getByRole('button', { name: /Reset to defaults/i });
    await expect(resetButton).toBeVisible();

    // Dimensions accordion is expanded by default — modify width
    const widthInput = page.getByLabel(/Width/i).first();
    await widthInput.fill('1000');
    await widthInput.blur();
    await page.waitForTimeout(300);

    // Click reset
    await resetButton.click();

    // Wait for reset to complete
    await page.waitForTimeout(300);

    // Check that width reverted to default (800)
    await expect(widthInput).toHaveValue('800');
  });

  test('should have download buttons', async ({ page }) => {
    // Download buttons are icon buttons with tooltips "Download as SVG" and "Download as PNG"
    const downloadSVGButton = page.getByRole('button', { name: /Download as SVG/i });
    const downloadPNGButton = page.getByRole('button', { name: /Download as PNG/i });

    await expect(downloadSVGButton).toBeVisible();
    await expect(downloadPNGButton).toBeVisible();
  });

  test('should expand and collapse wave settings accordion', async ({ page }) => {
    const waveSettingsAccordion = page.getByText(/Wave Settings/i);
    await waveSettingsAccordion.click();

    // Check for wave settings controls
    await expect(page.getByText(/Segment Count/i)).toBeVisible();
    await expect(page.getByText(/Layer Count/i)).toBeVisible();
    await expect(page.getByText(/Variance/i)).toBeVisible();

    // Collapse wave settings
    await waveSettingsAccordion.click();

    // Controls should no longer be visible
    await expect(page.getByText(/Segment Count/i)).toBeHidden();
  });

  test('should allow adjusting segment count', async ({ page }) => {
    // Expand wave settings
    const waveSettingsAccordion = page.getByText(/Wave Settings/i);
    await waveSettingsAccordion.click();

    // Find the slider for segment count
    const segmentSlider = page.locator('input[type="range"]').first();

    // Get the initial value (default: 20)
    const initialValue = await segmentSlider.inputValue();

    // Change the value
    await segmentSlider.fill('25');
    await page.waitForTimeout(500);

    // Verify the value was changed
    const newValue = await segmentSlider.inputValue();
    expect(newValue).toBe('25');
    expect(newValue).not.toBe(initialValue);

    // SVG should still be visible after change
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should expand and collapse stroke settings accordion', async ({ page }) => {
    const strokeAccordion = page.getByText(/Stroke Settings/i);
    await strokeAccordion.click();

    // Check for stroke controls
    await expect(page.getByText(/Stroke Width/i)).toBeVisible();
    await expect(page.getByText(/Stroke Color/i)).toBeVisible();
  });

  test('should expand gradient colors accordion', async ({ page }) => {
    const gradientAccordion = page.getByText(/Gradient Colors/i);
    await gradientAccordion.click();

    // Scope to the gradient colors accordion to avoid counting the stroke color input
    const gradientPanel = page.locator('.MuiAccordion-root').filter({ hasText: 'Gradient Colors' });
    const colorInputs = gradientPanel.locator('input[type="color"]');
    const count = await colorInputs.count();

    // Default has 3 gradient colors
    expect(count).toBe(3);
  });

  test('should allow adding a gradient color', async ({ page }) => {
    const gradientAccordion = page.getByText(/Gradient Colors/i);
    await gradientAccordion.click();

    // Scope to gradient accordion to avoid counting stroke color input
    const gradientPanel = page.locator('.MuiAccordion-root').filter({ hasText: 'Gradient Colors' });
    const colorInputsBefore = await gradientPanel.locator('input[type="color"]').count();

    // Click the "Add Color" button by its text
    const addButton = page.getByRole('button', { name: /Add Color/i });
    await addButton.click();

    // Wait for new color input
    await page.waitForTimeout(300);

    // Count color inputs after adding
    const colorInputsAfter = await gradientPanel.locator('input[type="color"]').count();

    // Should have one more color input
    expect(colorInputsAfter).toBe(colorInputsBefore + 1);
  });

  test('should allow removing a gradient color', async ({ page }) => {
    const gradientAccordion = page.getByText(/Gradient Colors/i);
    await gradientAccordion.click();

    // Scope to gradient accordion to avoid counting stroke color input
    const gradientPanel = page.locator('.MuiAccordion-root').filter({ hasText: 'Gradient Colors' });
    const colorInputsBefore = await gradientPanel.locator('input[type="color"]').count();
    expect(colorInputsBefore).toBeGreaterThan(2);

    // Delete buttons are icon-only buttons inside the gradient accordion
    const deleteButton = gradientPanel.locator('.MuiIconButton-root').first();
    await deleteButton.click();

    // Wait for color to be removed
    await page.waitForTimeout(300);

    // Count color inputs after removing
    const colorInputsAfter = await gradientPanel.locator('input[type="color"]').count();

    // Should have one less color input
    expect(colorInputsAfter).toBe(colorInputsBefore - 1);
  });

  test('should have color presets section', async ({ page }) => {
    // Check that the color presets accordion exists
    await expect(page.getByText('Color Presets')).toBeVisible();

    // Expand the color presets accordion
    const presetsAccordion = page.getByText('Color Presets');
    await presetsAccordion.click();
    await page.waitForTimeout(300);

    // Check that all presets are visible
    await expect(page.getByText('Sunset Blaze')).toBeVisible();
    await expect(page.getByText('Ocean Depths')).toBeVisible();
    await expect(page.getByText('Purple Dream')).toBeVisible();
    await expect(page.getByText('Forest Green')).toBeVisible();
    await expect(page.getByText('Warm Grayscale')).toBeVisible();
    await expect(page.getByText('Fire & Ice')).toBeVisible();
  });

  test('should apply preset colors when clicked', async ({ page }) => {
    // Expand the color presets accordion
    const presetsAccordion = page.getByText('Color Presets');
    await presetsAccordion.click();
    await page.waitForTimeout(300);

    // Click on Ocean Depths preset
    const oceanDepthsPreset = page.getByText('Ocean Depths');
    await oceanDepthsPreset.click();

    // Wait for the SVG to regenerate
    await page.waitForTimeout(500);

    // Verify the SVG is still visible after applying preset
    await expect(page.locator('svg').first()).toBeVisible();

    // Expand gradient colors to verify colors changed
    const gradientAccordion = page.getByText(/Gradient Colors/i);
    await gradientAccordion.click();
    await page.waitForTimeout(300);

    // Ocean Depths preset has 3 colors, verify color inputs in gradient accordion
    const gradientPanel = page.locator('.MuiAccordion-root').filter({ hasText: 'Gradient Colors' });
    const colorInputs = gradientPanel.locator('input[type="color"]');
    expect(await colorInputs.count()).toBe(3);
  });

  test('should have responsive layout', async ({ page }) => {
    // Check that both canvas and control panel are visible
    await expect(page.locator('svg').first()).toBeVisible();
    await expect(page.getByText(/Dimensions/i)).toBeVisible();

    // Both should be in the viewport
    const svgBox = await page.locator('svg').first().boundingBox();
    const controlPanelBox = await page.getByText(/Dimensions/i).boundingBox();

    expect(svgBox).not.toBeNull();
    expect(controlPanelBox).not.toBeNull();
  });

  test('should only expand one accordion at a time', async ({ page }) => {
    // Dimensions is expanded by default — width input should be visible
    await expect(page.getByLabel(/Width/i).first()).toBeVisible();

    // Click Wave Settings — Dimensions should collapse
    await page.getByText(/Wave Settings/i).click();
    await expect(page.getByText(/Segment Count/i)).toBeVisible();
    await expect(page.getByLabel(/Width/i).first()).toBeHidden();

    // Click Stroke Settings — Wave Settings should collapse
    await page.getByText(/Stroke Settings/i).click();
    await expect(page.getByText(/Stroke Width/i)).toBeVisible();
    await expect(page.getByText(/Segment Count/i)).toBeHidden();
  });
});
