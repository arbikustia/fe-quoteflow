import { expect, test } from '@playwright/test';

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
  for (const module of MASTER_MODULES) {
    test(`should display ${module.name} list`, async ({ page }) => {
      await page.goto(module.path);
      await expect(page).toHaveURL(module.path);
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }
});
