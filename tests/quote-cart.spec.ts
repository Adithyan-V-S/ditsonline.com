import { test, expect } from '@playwright/test';

test.describe('Feature 5: Quote Cart System & Bill of Materials', () => {
  test('Empty quote cart page displays empty state and navigation prompt', async ({ page }) => {
    // Clear localStorage before test
    await page.goto('/en/quote');
    await page.evaluate(() => localStorage.removeItem('dits_quote_cart'));
    await page.reload();

    await expect(page).toHaveTitle(/Quote Cart & Bill of Materials/i);
    await expect(page.locator('h2', { hasText: 'Your Quote Cart is Empty' })).toBeVisible();
    await expect(page.locator('a', { hasText: /Continue Browsing Parts|Continue Shopping/i })).toBeVisible();
  });

  test('Add product from catalogue, open drawer, and navigate to full BOM page', async ({ page }) => {
    await page.goto('/en/catalogue');

    // Find first "Add to Quote Cart" button on catalogue card
    const addBtn = page.locator('button:has-text("Add to Quote Cart")').first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Open cart drawer via header button
    const headerCartBtn = page.locator('button:has-text("My Quote")');
    await headerCartBtn.click();

    // Drawer should open and display the Link to Full BOM page
    const viewBomLink = page.locator('#view-full-bom-link');
    await expect(viewBomLink).toBeVisible();
    await viewBomLink.click();

    // Verify URL is /en/quote
    await expect(page).toHaveURL(/\/en\/quote/);
    await expect(page.locator('h2', { hasText: /Bill of Materials/i })).toBeVisible();
  });

  test('Quantity stepper updates line items and volume tier discounts', async ({ page }) => {
    // Navigate to product detail of RG2W-P gripper ($599) and add 1
    await page.goto('/en/catalogue/senserobot-rg2w-p');

    const addBtn = page.locator('#product-mode-action-btn');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Go to quote page
    await page.goto('/en/quote');

    // Should list RG2W-P
    await expect(page.locator('text=RG2W-P').first()).toBeVisible();

    // Increase quantity using the plus button to 5
    const plusBtn = page.locator('button[title="More"]').first();
    await plusBtn.click();
    await plusBtn.click();
    await plusBtn.click();
    await plusBtn.click(); // Now quantity is 5 (5% tier kicks in)

    // Verify 5% volume tier applied
    await expect(page.locator('text=5% bulk tier').first()).toBeVisible();
  });

  test('Submitting formal RFQ renders confirmation screen with RFQ ID', async ({ page }) => {
    // Ensure at least one item is in cart
    await page.goto('/en/catalogue/unitree-r1-basic');
    await page.locator('#product-mode-action-btn').click();

    // Go to /en/quote
    await page.goto('/en/quote');
    await expect(page.locator('h2', { hasText: /Bill of Materials/i })).toBeVisible();

    // Fill in RFQ Form
    await page.fill('#rfq-name-input', 'Robotics Researcher');
    await page.fill('#rfq-email-input', 'researcher@lab.org');
    await page.fill('#rfq-country-input', 'Germany');

    // Submit RFQ form
    const submitBtn = page.locator('button[type="submit"]:has-text("Send Quote Request")');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Expect confirmation message with quote ID
    await expect(page.locator('h2', { hasText: /Quote Request Submitted!/i })).toBeVisible();
    await expect(page.locator('text=RFQ #').first()).toBeVisible();
  });
});
