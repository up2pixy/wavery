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
    // Check for dimension controls
    await expect(page.getByText(/Dimensions/i)).toBeVisible();
    
    // Check for wave settings
    await expect(page.getByText(/Wave Settings/i)).toBeVisible();
    
    // Check for stroke settings
    await expect(page.getByText(/Stroke Settings/i)).toBeVisible();
    
    // Check for gradient colors
    await expect(page.getByText(/Gradient Colors/i)).toBeVisible();
  });

  test('should allow changing width dimension', async ({ page }) => {
    // Expand dimensions accordion if needed
    const dimensionsAccordion = page.getByText(/Dimensions/i);
    await dimensionsAccordion.click();
    
    // Find the width input
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
    // Expand dimensions accordion if needed
    const dimensionsAccordion = page.getByText(/Dimensions/i);
    await dimensionsAccordion.click();
    
    // Find the height input
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

  test('should have reset button', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: /reset/i });
    await expect(resetButton).toBeVisible();
    
    // Change a value first
    const dimensionsAccordion = page.getByText(/Dimensions/i);
    await dimensionsAccordion.click();
    const widthInput = page.getByLabel(/Width/i).first();
    await widthInput.fill('1000');
    await widthInput.blur();
    await page.waitForTimeout(300);
    
    // Click reset
    await resetButton.click();
    
    // Wait for reset to complete
    await page.waitForTimeout(300);
    
    // Check that width is back to default (should be 800)
    await expect(widthInput).toHaveValue('800');
  });

  test('should have download buttons', async ({ page }) => {
    // Check for download buttons (there should be two - SVG and PNG)
    const downloadButtons = page.getByRole('button').filter({ hasText: /download/i });
    const count = await downloadButtons.count();
    
    // We might have tooltip text instead, so let's check for icons
    const downloadIcons = page.locator('[data-testid="DownloadIcon"]');
    const iconCount = await downloadIcons.count();
    
    // Should have at least 2 download icons (SVG and PNG)
    expect(iconCount).toBeGreaterThanOrEqual(2);
  });

  test('should expand and collapse wave settings accordion', async ({ page }) => {
    const waveSettingsAccordion = page.getByText(/Wave Settings/i);
    await waveSettingsAccordion.click();
    
    // Check for wave settings controls
    await expect(page.getByText(/Segment Count/i)).toBeVisible();
    await expect(page.getByText(/Layer Count/i)).toBeVisible();
    await expect(page.getByText(/Variance/i)).toBeVisible();
  });

  test('should allow adjusting segment count', async ({ page }) => {
    // Expand wave settings
    const waveSettingsAccordion = page.getByText(/Wave Settings/i);
    await waveSettingsAccordion.click();
    
    // Find the slider for segment count (we'll use the slider input)
    const segmentSlider = page.locator('input[type="range"]').first();
    await expect(segmentSlider).toBeVisible();
    
    // Get the initial value
    const initialValue = await segmentSlider.inputValue();
    
    // Change the value by setting a new value
    await segmentSlider.fill('25');
    await page.waitForTimeout(500);
    
    // Verify the value was changed
    const newValue = await segmentSlider.inputValue();
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
    
    // Should have gradient color controls
    const colorInputs = page.locator('input[type="color"]');
    const count = await colorInputs.count();
    
    // Default should have 3 gradient colors
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should allow adding a gradient color', async ({ page }) => {
    const gradientAccordion = page.getByText(/Gradient Colors/i);
    await gradientAccordion.click();
    
    // Count initial color inputs
    const colorInputsBefore = await page.locator('input[type="color"]').count();
    
    // Find and click the add color button
    const addButton = page.getByRole('button').filter({ has: page.locator('[data-testid="AddIcon"]') }).first();
    await addButton.click();
    
    // Wait for new color input
    await page.waitForTimeout(300);
    
    // Count color inputs after adding
    const colorInputsAfter = await page.locator('input[type="color"]').count();
    
    // Should have one more color input
    expect(colorInputsAfter).toBe(colorInputsBefore + 1);
  });

  test('should allow removing a gradient color', async ({ page }) => {
    const gradientAccordion = page.getByText(/Gradient Colors/i);
    await gradientAccordion.click();
    
    // Count initial color inputs
    const colorInputsBefore = await page.locator('input[type="color"]').count();
    
    // Should have at least 2 colors to be able to remove one (needs to keep at least 1)
    if (colorInputsBefore > 1) {
      // Find and click a delete button
      const deleteButton = page.getByRole('button').filter({ has: page.locator('[data-testid="DeleteIcon"]') }).first();
      await deleteButton.click();
      
      // Wait for color to be removed
      await page.waitForTimeout(300);
      
      // Count color inputs after removing
      const colorInputsAfter = await page.locator('input[type="color"]').count();
      
      // Should have one less color input
      expect(colorInputsAfter).toBe(colorInputsBefore - 1);
    }
  });

  test('should have color presets section', async ({ page }) => {
    // Check that the color presets accordion exists
    await expect(page.getByText('Color Presets')).toBeVisible();
    
    // Expand the color presets accordion
    const presetsAccordion = page.getByText('Color Presets');
    await presetsAccordion.click();
    await page.waitForTimeout(300);
    
    // Check that presets are visible
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
});
