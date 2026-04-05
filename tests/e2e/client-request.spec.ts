import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('should load home page correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Sourcing de Produits' })).toBeVisible({ timeout: 10000 });
  });

  test('should load tendances page', async ({ page }) => {
    await page.goto('/trends');
    await expect(page.getByRole('heading', { name: 'Découvrez nos nouveaux produits' })).toBeVisible({ timeout: 10000 });
  });

  test('should load actualites page', async ({ page }) => {
    await page.goto('/news');
    await expect(page.getByRole('heading', { name: 'Dernières nouvelles' })).toBeVisible({ timeout: 10000 });
  });

  test('should navigate from navbar correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click on Nouveautés in navbar
    await page.getByRole('link', { name: 'Nouveautés' }).click();
    await expect(page).toHaveURL('/trends');
    
    // Click on Actualités in navbar
    await page.getByRole('link', { name: 'Actualités' }).click();
    await expect(page).toHaveURL('/news');
  });

  test('should navigate to login page from navbar', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Espace client' }).click();
    await expect(page).toHaveURL('/auth/login');
  });
});
