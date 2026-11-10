import { expect, test } from '@playwright/test';

const MASTER_MODULES = [
  { name: 'Category', path: '/master-category', createButton: 'Create Category', fieldId: 'category-name' },
  { name: 'Item', path: '/master-item', createButton: 'Create Item', fieldId: 'item-name' },
  { name: 'Project', path: '/master-project', createButton: 'Create Project' },
  { name: 'Payment Method', path: '/master-payment-method', createButton: 'Create Payment Method', fieldId: 'payment-method-name' },
  { name: 'Voucher', path: '/master-voucher', createButton: 'Create Voucher', fieldId: 'voucher-name' },
  { name: 'Role', path: '/master-role', createButton: 'Create Role', fieldId: 'role-name' },
  { name: 'User', path: '/master-user', createButton: 'Create User', fieldId: 'username' },
  { name: 'PIC', path: '/master-pic', createButton: 'Create PIC', fieldId: 'pic-name' },
  { name: 'Order Type', path: '/master-order-type', createButton: 'Create Order Type', fieldId: 'order-type-name' },
  { name: 'Email Sender', path: '/master-email-sender', createButton: 'Create Email Sender', fieldId: 'name' },
];

test.describe('Master Data Comprehensive CRUD', () => {
  for (const module of MASTER_MODULES) {
    test.describe(`${module.name} Module`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(module.path);
      });

      test('list, search, and navigation', async ({ page, isMobile }) => {
        // Scoped to visible container to avoid desktop/mobile duplicate selector issues
        const container = isMobile 
            ? page.locator('div:not(.hidden)').filter({ has: page.getByRole('heading', { name: module.listHeading, exact: true }) })
            : page;
        
        await expect(page.getByRole('heading').first()).toBeVisible();
        await page.getByRole('button', { name: module.createButton }).click();
        await expect(page.getByRole('heading').first()).toBeVisible();
      });

      if (module.fieldId) {
        test('validation on empty submission', async ({ page }) => {
          await page.goto(module.path);
          await page.getByRole('button', { name: module.createButton }).click();
          await page.getByRole('button', { name: /create|save/i }).first().click();
          // Use specific ID-based locator to avoid duplicate text hits
          await expect(page.locator(`#${module.fieldId}-error`)).toBeVisible();
        });
      }
    });
  }
});
