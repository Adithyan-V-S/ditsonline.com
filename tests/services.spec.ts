import { test, expect } from '@playwright/test';

test.describe('Feature 6: Service Pages & Reseller Application', () => {
  test('Services Overview Page renders all 5 core service offerings', async ({ page }) => {
    await page.goto('/en/services');

    await expect(page).toHaveTitle(/Robotics Lifecycle Services · DITS Online/i);
    await expect(page.locator('h1', { hasText: 'Robotics Lifecycle Services' })).toBeVisible();

    // Verify all 5 service sub-routes are linked
    await expect(page.locator('a[href*="/services/distribution"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/services/rental"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/services/education"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/services/repair"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/services/reseller"]').first()).toBeVisible();
  });

  test('Robot Fleet Rental page displays fleet roster and submits booking inquiry', async ({ page }) => {
    await page.goto('/en/services/rental');

    await expect(page.locator('h1', { hasText: 'Robot Fleet Rental & Leasing' })).toBeVisible();

    // Verify fleet models are listed
    await expect(page.locator('h3', { hasText: 'Unitree Go2 (With 4D LiDAR)' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Unitree G1 Humanoid' })).toBeVisible();

    // Fill out rental inquiry form
    await page.fill('#rental-location-input', 'Singapore Sands Expo');
    await page.fill('#rental-name-input', 'Elena Rostova');
    await page.fill('#rental-email-input', 'elena@cyber-event.sg');

    // Submit form
    const submitBtn = page.locator('#submit-rental-btn');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify success confirmation with Ref ID
    await expect(page.locator('h3', { hasText: 'Rental Fleet Inquiry Received' })).toBeVisible();
    await expect(page.locator('text=Booking Ref #RENT-')).toBeVisible();
  });

  test('Authorized Reseller page displays margin tiers and submits partner application', async ({ page }) => {
    await page.goto('/en/services/reseller');

    await expect(page.locator('h1', { hasText: 'Authorized Reseller Program' })).toBeVisible();

    // Verify margin tier indicators
    await expect(page.locator('text=15% Margin')).toBeVisible();
    await expect(page.locator('text=22% Margin')).toBeVisible();
    await expect(page.locator('text=35% Margin')).toBeVisible();

    // Fill out reseller application form
    await page.fill('#reseller-company-name', 'Nordic Autonomous Systems AB');
    await page.fill('#reseller-contact-name', 'Lars Lindqvist');
    await page.fill('#reseller-email-input', 'lars@nordic-auto.se');
    await page.fill('#reseller-phone-input', '+46 8 123 4567');

    // Submit application
    const submitBtn = page.locator('#submit-reseller-btn');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify confirmation with Ref ID
    await expect(page.locator('h3', { hasText: 'Reseller Partnership Application Dispatched' })).toBeVisible();
    await expect(page.locator('text=Application Ref #RES-')).toBeVisible();
  });

  test('Maintenance & Repair page presents diagnostic capabilities and submits intake', async ({ page }) => {
    await page.goto('/en/services/repair');

    await expect(page.locator('h1', { hasText: 'Maintenance & Calibration' })).toBeVisible();
    await expect(page.locator('text=Harmonic Drive & Gearbox Overhaul')).toBeVisible();
    await expect(page.locator('text=180-Day Post-Service Warranty')).toBeVisible();

    // Fill out repair intake form
    await page.fill('#service-model-input', 'Unitree Go2 Leg Actuator');
    await page.fill('#service-name-input', 'Dr. Marcus Vance');
    await page.fill('#service-email-input', 'vance@dynamics-lab.org');
    await page.fill('#service-details-input', 'Overcurrent fault on right rear knee harmonic joint motor under load.');

    // Submit form
    const submitBtn = page.locator('#submit-service-btn-repair');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify confirmation with Ref ID
    await expect(page.locator('h3', { hasText: 'Inquiry Assigned to Application Engineering' })).toBeVisible();
    await expect(page.locator('text=Case Ref #SRV-')).toBeVisible();
  });

  test('Academic & Education page highlights university grant assistance and research clusters', async ({ page }) => {
    await page.goto('/en/services/education');

    await expect(page.locator('h1', { hasText: 'Academic & Research Kits' })).toBeVisible();
    await expect(page.locator('text=Embodied AI & Humanoid Research Cluster')).toBeVisible();
    await expect(page.locator('text=University Grant & Tender Assistance')).toBeVisible();
  });
});
