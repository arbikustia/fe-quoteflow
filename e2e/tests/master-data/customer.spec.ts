import { expect, test } from '@playwright/test';

test.describe('Master Data - Customer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/master-customer');
    await expect(page).toHaveURL('/master-customer');
  });

  test('should display customer list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Customer List' })).toBeVisible();
  });

  test('should show required errors for empty customer creation', async ({ page }) => {
    await page.goto('/master-customer/create');
    await page.getByRole('button', { name: 'Create Customer' }).click();
    await expect(page.getByText('Customer name is required.', { exact: true })).toBeVisible();
    await expect(page.getByText('Email is required.', { exact: true })).toBeVisible();
    await expect(page.getByText('Phone number is required.', { exact: true })).toBeVisible();
    await expect(page.getByText('Address is required.', { exact: true })).toBeVisible();
  });
});
