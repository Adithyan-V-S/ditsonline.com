import { test, expect } from '@playwright/test';

test.describe('Feature 1: Design System & Core Shell', () => {
  test('Header renders with logo, search, language switch and quote counter', async ({ page }) => {
    await page.goto('/en');

    // Check title and logo
    await expect(page).toHaveTitle(/DITS Online/);
    const logo = page.locator('header a', { hasText: 'DITSONLINE' });
    await expect(logo).toBeVisible();

    // Check search input
    const searchInput = page.locator('#global-search-input');
    await expect(searchInput).toBeVisible();

    // Check quote cart trigger and counter
    const quoteBtn = page.locator('#quote-cart-trigger');
    await expect(quoteBtn).toBeVisible();
    const counterBadge = page.locator('#quote-cart-counter-badge');
    await expect(counterBadge).toHaveText('0');
  });

  test('Language switch toggles between English and Chinese routes', async ({ page }) => {
    await page.goto('/en');

    const langBtn = page.locator('#lang-switcher-btn');
    await expect(langBtn).toBeVisible();
    await expect(langBtn).toHaveText(/中文/);

    // Click to toggle to Chinese
    await langBtn.click();
    await expect(page).toHaveURL(/\/zh/);
    await expect(langBtn).toHaveText(/EN/);

    // Click to toggle back to English
    await langBtn.click();
    await expect(page).toHaveURL(/\/en/);
  });

  test('Quote cart drawer opens, displays empty state, and closes', async ({ page }) => {
    await page.goto('/en');

    // Open drawer
    await page.locator('#quote-cart-trigger').click();
    const drawerHeading = page.locator('h2', { hasText: /Quote Cart/i });
    await expect(drawerHeading).toBeVisible();

    // Empty state message
    await expect(page.locator('text=Your quote cart is empty')).toBeVisible();

    // Close drawer
    await page.locator('#close-quote-drawer').click();
    await expect(drawerHeading).not.toBeVisible();
  });

  test('Footer and Contact Floating buttons render properly', async ({ page }) => {
    await page.goto('/en');

    // Footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=Verified Direct Supply Chain')).toBeVisible();

    // Floating contact buttons
    await expect(page.locator('#whatsapp-floating-btn')).toBeVisible();
    await expect(page.locator('#wechat-floating-btn')).toBeVisible();

    // Open WeChat modal
    await page.locator('#wechat-floating-btn').click();
    await expect(page.locator('h3', { hasText: 'Chat on WeChat' })).toBeVisible();
    await expect(page.locator('.select-all', { hasText: '+86 135 1048 3282' })).toBeVisible();
  });
});
