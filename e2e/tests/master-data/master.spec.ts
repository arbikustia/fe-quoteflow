import { test, expect } from '@playwright/test';

const MASTER_MODULES = [
  { name: 'Category', path: '/master-category' },
  { name: 'Item', path: '/master-item' },
  { name: 'Project', path: '/master-project' },
  { name: 'Payment Method', path: '/master-payment-method' },
  { name: 'Voucher', path: '/master-voucher' },
  { name: 'Role', path: '/master-role' },
  { name: 'User', path: '/master-user' },
  { name: 'PIC', path: '/master-pic' },
  { name: 'Order Type', path: '/master-order-type' },
  { name: 'Email Sender', path: '/master-email-sender' },
];

test.describe('Master Data Modules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('name@sonicline.co.id').fill('arbi');
    await page.getByPlaceholder('••••••••').fill('arbi123');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await page.waitForURL('/home');
  });

  for (const module of MASTER_MODULES) {
    test(`Positive: should display ${module.name} list`, async ({ page }) => {
      await page.goto(module.path);
      await expect(page.getByRole('heading')).toBeVisible();
    });
  }
});
