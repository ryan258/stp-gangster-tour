import { test, expect } from '@playwright/test';

test.describe('Saint Paul After Dark — End to End Flow', () => {
  test('landing page loads and contains key editorial elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Saint Paul After Dark/);
    await expect(page.locator('h1')).toContainText('SAINT PAUL AFTER DARK');
    await expect(page.locator('a[href="/prologue/"]').first()).toBeVisible();
    await expect(page.locator('a[href="/map/"]').first()).toBeVisible();
  });

  test('prologue loads and links to Stop 1', async ({ page }) => {
    await page.goto('/prologue/');
    await expect(page.locator('h1')).toContainText('A City with Two Sets of Rules');
    const startBtn = page.locator('a[href="/stops/the-arrangement/"]').first();
    await expect(startBtn).toBeVisible();
  });

  test('stop 1 renders narrative, audio controls, and presenter', async ({ page }) => {
    await page.goto('/stops/the-arrangement/');
    await expect(page.locator('h1')).toContainText('The Arrangement');
    await expect(page.locator('.audio-player-panel')).toBeVisible();
    await expect(page.locator('.interactive-presenter')).toBeVisible();

    // Verify condition selection
    const payBtn = page.locator('button[data-selection="pay"]');
    await payBtn.click();
    await expect(payBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.presenter-target[data-target-key="pay"]')).toHaveClass(/selected-highlight/);
  });

  test('map renders all 7 stops', async ({ page }) => {
    await page.goto('/map/');
    await expect(page.locator('h1')).toContainText('Saint Paul Underworld Map');
    const stopItems = page.locator('ol li');
    await expect(stopItems).toHaveCount(7);
  });

  test('casebook displays 14 evidence items', async ({ page }) => {
    await page.goto('/casebook/');
    await expect(page.locator('h1')).toContainText('Casebook Evidence Ledger');
    const items = page.locator('.casebook-item-card');
    await expect(items).toHaveCount(14);
  });

  test('sources page displays claims and sources', async ({ page }) => {
    await page.goto('/sources/');
    await expect(page.locator('h1')).toContainText('Sources & Verified Claims');
    await expect(page.locator('[id^="claim-C"]')).toHaveCount(30);
    await expect(page.locator('[id^="source-S"]')).toHaveCount(16);
  });
});
