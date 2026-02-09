import { test, expect } from '@playwright/test';

test.describe('Event Selection and Detail View', () => {
  test('clicking an event marker opens detail panel', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load
    await page.waitForSelector('.event-marker, .event-range', { timeout: 10000 });

    // Find the first clickable event marker
    const firstMarker = page.locator('.event-marker').first();
    await firstMarker.waitFor({ state: 'visible', timeout: 5000 });

    // Click the event marker
    await firstMarker.click();

    // Wait for detail panel to update
    await page.waitForTimeout(500);

    // The detail panel should show event title
    const detailTitle = page.locator('.event-detail h2');
    await expect(detailTitle).toBeVisible();

    // Should see at least one source
    const sourcesList = page.locator('.sources-list');
    await expect(sourcesList).toBeVisible();
  });

  test('event card click opens detail view', async ({ page }) => {
    await page.goto('/');

    // Wait for event list to load
    await page.waitForSelector('.event-card', { timeout: 10000 });

    // Get the first event card
    const firstCard = page.locator('.event-card').first();
    await expect(firstCard).toBeVisible();

    // Get the title from the card
    const cardTitle = await firstCard.locator('.event-card-title').textContent();

    // Click the card
    await firstCard.click();

    // Wait for detail panel to open
    await page.waitForTimeout(500);

    // Detail panel should show the same event
    const detailTitle = page.locator('.event-detail h2');
    await expect(detailTitle).toBeVisible();
    const detailTitleText = await detailTitle.textContent();
    expect(detailTitleText).toBe(cardTitle);

    // Card should be marked as active
    await expect(firstCard).toHaveClass(/active/);
  });

  test('detail panel displays narrative and sources', async ({ page }) => {
    await page.goto('/');

    // Wait and click first event
    await page.waitForSelector('.event-card', { timeout: 10000 });
    await page.locator('.event-card').first().click();
    await page.waitForTimeout(500);

    // Check narrative section exists
    const narrative = page.locator('.event-detail-narrative');
    await expect(narrative).toBeVisible();

    // Check that narrative has content (at least one paragraph)
    const paragraphs = narrative.locator('p');
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);

    // Check sources section
    const sourcesSection = page.locator('.event-detail-sources');
    await expect(sourcesSection).toBeVisible();

    // At least one source item should be present
    const sourceItems = page.locator('.source-item');
    const sourceCount = await sourceItems.count();
    expect(sourceCount).toBeGreaterThan(0);
  });

  test('unverified sources show badge', async ({ page }) => {
    await page.goto('/');

    // Click first event
    await page.waitForSelector('.event-card', { timeout: 10000 });
    await page.locator('.event-card').first().click();
    await page.waitForTimeout(500);

    // Look for any source with the "Suggested — Verify" badge
    const suggestedBadge = page.locator('.source-badge.suggested');
    
    // Our seed data has unverified sources, so at least one should exist
    const badgeCount = await suggestedBadge.count();
    expect(badgeCount).toBeGreaterThan(0);
  });
});
