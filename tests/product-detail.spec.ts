import { test, expect } from '@playwright/test';

test.describe('Feature 4: Product Detail Page', () => {
  test('Product detail page loads with gallery, breadcrumbs, and specifications', async ({ page }) => {
    await page.goto('/en/catalogue/unitree-r1-basic');

    // Title and Brand
    await expect(page).toHaveTitle(/Unitree R1 Basic · DITS Online/);
    await expect(page.locator('h1', { hasText: 'Unitree R1 Basic' })).toBeVisible();

    // Breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator('text=Catalogue')).toBeVisible();

    // Gallery
    await expect(page.locator('img[alt="Unitree R1 Basic"]').first()).toBeVisible();

    // Spec table
    await expect(page.locator('text=Technical Specifications')).toBeVisible();
    await expect(page.locator('text=Degrees of Freedom (DOF)')).toBeVisible();
  });

  test('Unpriced product shows "Request a Quote" and NEVER displays "$0"', async ({ page }) => {
    await page.goto('/en/catalogue/unitree-r1-basic');

    // Button should be Request a Quote
    const actionBtn = page.locator('#product-mode-action-btn');
    await expect(actionBtn).toBeVisible();
    await expect(actionBtn).toHaveText(/Request a Quote/i);

    // Verify it NEVER shows "$0" or "$0.00"
    await expect(page.locator('text=$0')).not.toBeVisible();
    await expect(page.locator('text=$0.00')).not.toBeVisible();
  });

  test('Priced product shows unit price, bulk tiers, and "Buy Now"', async ({ page }) => {
    await page.goto('/en/catalogue/senserobot-rg2w-p');

    // Should show price
    await expect(page.locator('text=$599')).toBeVisible();

    // Primary button should indicate Buy Now
    const actionBtn = page.locator('#product-mode-action-btn');
    await expect(actionBtn).toHaveText(/Buy Now/i);

    // Bulk pricing tiers section
    await expect(page.locator('text=Tiered Bulk Pricing Available')).toBeVisible();
  });

  test('Variant selector switches models within family', async ({ page }) => {
    await page.goto('/en/catalogue/unitree-r1-basic');

    // Look for variant selector
    const variantSection = page.locator('text=Models & Configurations').locator('..');
    await expect(variantSection).toBeVisible();

    // Click variant pill
    const eduVariant = page.locator('a', { hasText: /R1 Edu/i }).first();
    await expect(eduVariant).toBeVisible();
    await eduVariant.click();

    // URL should change to the edu variant
    await expect(page).toHaveURL(/unitree-r1-edu/);
  });

  test('Adding product from detail page increments header quote cart counter', async ({ page }) => {
    await page.goto('/en/catalogue/unitree-r1-basic');

    const counterBadge = page.locator('#quote-cart-counter-badge');
    await expect(counterBadge).toHaveText('0');

    // Click primary action button
    const actionBtn = page.locator('#product-mode-action-btn');
    await actionBtn.click();

    // Should indicate Added and counter badge should increment to 1
    await expect(page.locator('text=Added to Quote Cart')).toBeVisible();
    await expect(counterBadge).toHaveText('1');
  });
});
