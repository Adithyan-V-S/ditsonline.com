import { test, expect } from '@playwright/test';

test.describe('Feature 3: Catalogue Page & Advanced Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/catalogue');
  });

  test('Catalogue page loads with title, filters, and products grid', async ({ page }) => {
    await expect(page).toHaveTitle(/Catalogue · DITS Online/);

    // Title
    await expect(page.locator('h1', { hasText: 'Robotics & Components Catalogue' })).toBeVisible();

    // Verify filter elements
    await expect(page.locator('#catalogue-search-input')).toBeVisible();
    await expect(page.locator('#brand-filter-select')).toBeVisible();
    await expect(page.locator('#robot-compatibility-select')).toBeVisible();
    await expect(page.locator('#catalogue-sort-select')).toBeVisible();

    // Verify product cards are displayed
    const productCards = page.locator('article, .glass-card');
    await expect(productCards.first()).toBeVisible();
  });

  test('Category tabs filter products by category', async ({ page }) => {
    // Click on "Quadrupeds" tab
    const quadTab = page.locator('button', { hasText: 'Quadrupeds' });
    await expect(quadTab).toBeVisible();
    await quadTab.click();

    // URL should update
    await expect(page).toHaveURL(/category=quad/);

    // Verify products displayed belong to category
    await expect(page.locator('text=Unitree').first()).toBeVisible();
  });

  test('Brand filter dropdown filters products by brand', async ({ page }) => {
    const brandSelect = page.locator('#brand-filter-select');
    await brandSelect.selectOption('Unitree');

    // URL should update with brand
    await expect(page).toHaveURL(/brand=Unitree/);
    await expect(page.locator('span', { hasText: 'Unitree' }).first()).toBeVisible();
  });

  test('Robot compatibility filter ("Fits which robot") filters compatible parts', async ({ page }) => {
    const robotSelect = page.locator('#robot-compatibility-select');
    await robotSelect.selectOption('Unitree G1');

    // URL should reflect compatibility query
    await expect(page).toHaveURL(/fits_robot=Unitree\+G1/);

    // Verify result status indicates filtered by Unitree G1
    await expect(page.locator('text=Filtered by: Unitree G1')).toBeVisible();
  });

  test('Search input filters items and reset filters clears query', async ({ page }) => {
    const searchInput = page.locator('#catalogue-search-input');
    await searchInput.fill('camera');
    await searchInput.press('Enter');

    // URL should contain query
    await expect(page).toHaveURL(/q=camera/);

    // Reset button should appear
    const resetBtn = page.locator('#reset-catalogue-filters-btn');
    await expect(resetBtn).toBeVisible();

    // Click reset
    await resetBtn.click();
    await expect(page).not.toHaveURL(/q=camera/);
  });

  test('Add to quote action increments header cart counter', async ({ page }) => {
    const counterBadge = page.locator('#quote-cart-counter-badge');
    await expect(counterBadge).toHaveText('0');

    // Add first item in grid
    const addBtn = page.locator('button', { hasText: 'Add to Quote' }).first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Counter badge should increment
    await expect(counterBadge).toHaveText('1');
  });
});
