import { test, expect } from '@playwright/test';

test.describe('Feature 2: Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('Hero section renders with headline, badges, and CTA buttons', async ({ page }) => {
    // Badge
    await expect(page.locator('text=Official Robotics Hardware Supply Chain')).toBeVisible();

    // Headline
    await expect(
      page.locator('h1', { hasText: 'Industrial-Grade Robots & Precision Parts' })
    ).toBeVisible();

    // CTAs
    const exploreBtn = page.locator('#hero-explore-catalogue-btn');
    await expect(exploreBtn).toBeVisible();

    const quoteBtn = page.locator('#hero-request-quote-btn');
    await expect(quoteBtn).toBeVisible();

    // Metrics
    await expect(page.locator('text=300+ Parts')).toBeVisible();
    await expect(page.getByText('Direct Source', { exact: true })).toBeVisible();
  });

  test('Category tiles render all 11 core categories with parts counts', async ({ page }) => {
    const categoriesSection = page.locator('text=Hardware Taxonomy').locator('..');
    await expect(categoriesSection).toBeVisible();

    // Verify key categories
    await expect(page.locator('h3', { hasText: 'Humanoids' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Quadrupeds' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Robot Arms' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Hands & Grippers' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Compute & Controllers' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Vision & Depth Cameras' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Micro Motors' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Joint Modules' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'CNC & Structural Parts' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Harmonic Actuators' })).toBeVisible();
  });

  test('Featured parts render and Add to Quote button updates header counter', async ({ page }) => {
    // Check initial counter is 0
    const counterBadge = page.locator('#quote-cart-counter-badge');
    await expect(counterBadge).toHaveText('0');

    // Find first add button in featured parts
    const addBtn = page.locator('button', { hasText: 'Add to Quote Cart' }).first();
    await expect(addBtn).toBeVisible();

    // Click to add
    await addBtn.click();

    // Expect button to indicate Added and badge to increment to 1
    await expect(page.locator('text=Added').first()).toBeVisible();
    await expect(counterBadge).toHaveText('1');

    // Open drawer to verify item is inside
    await page.locator('#quote-cart-trigger').click();
    await expect(page.locator('h2', { hasText: 'Quote Cart & Inquiry' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Send Quote Request' })).toBeVisible();
    await page.locator('#close-quote-drawer').click();
  });

  test('Service tiles render with all 5 core service offerings', async ({ page }) => {
    await expect(page.locator('h3', { hasText: 'Global Distribution' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Robot Fleet Rental' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Academic & Research Kits' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Maintenance & Calibration' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Authorized Reseller Program' })).toBeVisible();
  });

  test('Robots in motion video section opens video demo modal', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Robots in Motion' })).toBeVisible();

    // Click first video card
    const firstVideoCard = page.locator('text=Unitree G1 Humanoid').first();
    await expect(firstVideoCard).toBeVisible();
    await firstVideoCard.click();

    // Video modal should open
    await expect(page.locator('text=Motion testing stream connected')).toBeVisible();

    // Close modal
    await page.locator('button:has(svg.lucide-x)').click();
  });

  test('Blog guides teaser renders and opens guide reader modal', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Guides & Robot News' })).toBeVisible();

    // Click first blog post
    const firstPost = page.locator('text=Choosing Your First Humanoid Robot').first();
    await expect(firstPost).toBeVisible();
    await firstPost.click();

    // Reader modal should open
    await expect(page.locator('text=Engineering Advisory Note')).toBeVisible();

    // Close
    await page.locator('button', { hasText: 'Close' }).click();
  });
});
