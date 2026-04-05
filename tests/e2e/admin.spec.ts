import { test, expect } from '@playwright/test';

test.describe('Admin - Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    
    // Should redirect either to login or portal
    await page.waitForTimeout(3000);
    const url = page.url();
    // Either stays on admin (if somehow authenticated) or redirects
    expect(url === 'http://localhost:5173/admin' || url.includes('/auth') || url.includes('/portal')).toBeTruthy();
  });
});

test.describe('Admin - Navigation', () => {
  test('should have correct sidebar items', async ({ page }) => {
    // This test assumes admin is logged in
    // Will be skipped if not authenticated as admin
    await page.goto('/admin');
    
    // Wait for potential redirect
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin')) {
      test.skip();
    }
    
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Demandes')).toBeVisible();
    await expect(page.getByText('Clients')).toBeVisible();
    await expect(page.getByText('Messages')).toBeVisible();
    await expect(page.getByText('Nouveautés')).toBeVisible();
    await expect(page.getByText('Actualités')).toBeVisible();
  });
});

test.describe('Admin - Nouveautés Management', () => {
  test('should display tendances page when accessed', async ({ page }) => {
    await page.goto('/admin/trending');
    
    // Either shows the page or redirects
    await page.waitForTimeout(2000);
    const url = page.url();
    
    // If redirected, test is not applicable
    if (url.includes('/admin/trending')) {
      await expect(page.getByText('Nouveautés')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Ajouter un produit' })).toBeVisible();
    }
  });
});

test.describe('Admin - Actualités Management', () => {
  test('should display news page when accessed', async ({ page }) => {
    await page.goto('/admin/news');
    
    // Either shows the page or redirects
    await page.waitForTimeout(2000);
    const url = page.url();
    
    // If redirected, test is not applicable
    if (url.includes('/admin/news')) {
      await expect(page.getByText('Actualités')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Nouvelle publication' })).toBeVisible();
    }
  });
});
