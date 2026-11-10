import { test, expect } from '@playwright/test';

test.describe('Master Data - Customer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('name@sonicline.co.id').fill('arbi');
    await page.getByPlaceholder('••••••••').fill('arbi123'); // Assuming known credential structure
    await page.getByRole('button', { name: 'Masuk' }).click();
    await page.waitForURL('/home');
    await page.goto('/master-customer');
  });

  test('Positive: should display customer list', async ({ page }) => {
    await expect(page.getByText('Customer')).toBeVisible();
  });

  test('Negative: should show error for invalid customer creation (missing fields)', async ({ page }) => {
    await page.goto('/master-customer/create');
    await page.getByRole('button', { name: /save|simpan/i }).click();
    await expect(page.getByText(/required|wajib/i)).toBeVisible();
  });
});
