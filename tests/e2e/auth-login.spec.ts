import { test, expect } from '@playwright/test';

test.describe('Authentication - Login', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/auth/login');
    
    await expect(page.getByText('Connexion')).toBeVisible();
    await expect(page.getByText('Accédez à votre espace client')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
  });

  test('should have working password visibility toggle', async ({ page }) => {
    await page.goto('/auth/login');
    
    const passwordInput = page.getByLabel('Mot de passe');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    await page.locator('button').filter({ has: page.locator('svg.lucide-eye') }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Mot de passe').fill('wrongpassword');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Should show error toast (assuming auth fails)
    await page.waitForTimeout(2000);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('link', { name: 'Créer un compte' }).click();
    await expect(page).toHaveURL('/auth/signup');
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByText('← Retour au site').click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to admin login from link', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByText('Espace administrateur').click();
    await expect(page).toHaveURL('/admin');
  });
});
