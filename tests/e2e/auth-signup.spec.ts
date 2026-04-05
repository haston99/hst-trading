import { test, expect } from '@playwright/test';

test.describe('Authentication - Signup', () => {
  test('should display signup page correctly', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page.getByText('Créer un compte')).toBeVisible();
    await expect(page.getByText('Rejoignez HST Trading')).toBeVisible();
    await expect(page.getByLabel('Nom complet')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();
  });

  test('should have working password visibility toggle', async ({ page }) => {
    await page.goto('/auth/signup');
    
    const passwordInput = page.getByLabel('Mot de passe');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    await page.locator('button').filter({ has: page.locator('svg.lucide-eye') }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.getByRole('link', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.getByText('← Retour au site').click();
    await expect(page).toHaveURL('/');
  });
});
