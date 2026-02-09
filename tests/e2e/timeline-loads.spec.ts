import { test, expect } from '@playwright/test';

test.describe('Timeline Loading', () => {
  test('app loads and displays timeline with BCE labels', async ({ page }) => {
    await page.goto('/');

    // Wait for loading to complete
    await expect(page.locator('h1')).toContainText('Roman History Interactive Timeline');

    // Timeline SVG should be visible
    const svg = page.locator('.timeline-svg');
    await expect(svg).toBeVisible();

    // Check for at least one BCE label on the axis
    const axisLabels = page.locator('.timeline-axis text');
    await expect(axisLabels.first()).toBeVisible({ timeout: 10000 });

    // Count how many labels contain "BCE"
    const labelCount = await axisLabels.count();
    let bceCount = 0;
    for (let i = 0; i < labelCount; i++) {
      const text = await axisLabels.nth(i).textContent();
      if (text?.includes('BCE')) {
        bceCount++;
      }
    }
    expect(bceCount).toBeGreaterThan(0);
  });

  test('timeline displays event markers', async ({ page }) => {
    await page.goto('/');

    // Wait for events to load
    await page.waitForSelector('.event-marker, .event-range', { timeout: 10000 });

    // Check that at least one event marker or range is visible
    const markers = page.locator('.event-marker, .event-range rect, .event-range circle');
    const count = await markers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('zoom controls are functional', async ({ page }) => {
    await page.goto('/');

    // Wait for zoom controls to be visible
    const zoomInButton = page.locator('.zoom-buttons button').first();
    await expect(zoomInButton).toBeVisible();

    // Get initial zoom level
    const zoomLevel = page.locator('.zoom-level');
    const initialZoom = await zoomLevel.textContent();

    // Click zoom in
    await zoomInButton.click();

    // Wait a moment for zoom to update
    await page.waitForTimeout(500);

    // Check that zoom level changed
    const newZoom = await zoomLevel.textContent();
    expect(newZoom).not.toBe(initialZoom);
  });
});
