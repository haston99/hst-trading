import { test, expect } from '@playwright/test';

test.describe('Functional - Landing Page', () => {
  test('homepage loads with all sections', async ({ page }) => {
    await page.goto('/');
    
    // Hero section
    await expect(page.getByRole('heading', { name: 'Sourcing de Produits' })).toBeVisible();
    
    // Services section - use heading instead
    await expect(page.getByRole('heading', { name: 'Nos services de bout en bout' })).toBeVisible();
    
    // How it works
    await expect(page.getByRole('heading', { name: 'Comment ça marche' })).toBeVisible();
    
    // Why us
    await expect(page.getByRole('heading', { name: "L'expertise locale au service de votre business" })).toBeVisible();
    
    // Products/Catalogue
    await expect(page.getByRole('heading', { name: 'Tous types de produits' })).toBeVisible();
  });

  test('navbar navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Click Nouveautés
    await page.getByRole('link', { name: 'Nouveautés' }).click();
    await expect(page).toHaveURL('/trends');
    
    // Click Actualités
    await page.getByRole('link', { name: 'Actualités' }).click();
    await expect(page).toHaveURL('/news');
  });

  test('contact section is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Click Demander un devis button
    await page.getByRole('button', { name: 'Demander un devis' }).click();
    await page.waitForTimeout(500);
    
    // Should be at contact section
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
  });
});

test.describe('Functional - Nouveautés Page', () => {
  test('nouveautés page loads correctly', async ({ page }) => {
    await page.goto('/trends');
    
    await expect(page.getByRole('heading', { name: 'Découvrez nos nouveaux produits' })).toBeVisible();
    await expect(page.getByText('Les dernières nouveautés')).toBeVisible();
  });
});

test.describe('Functional - Actualités Page', () => {
  test('actualités page loads correctly', async ({ page }) => {
    await page.goto('/news');
    
    await expect(page.getByRole('heading', { name: 'Dernières nouvelles' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tous' })).toBeVisible();
  });
});

test.describe('Functional - Authentication Pages', () => {
  test('login page is fully functional', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check form elements
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    
    // Check links
    await expect(page.getByRole('link', { name: 'Créer un compte' })).toBeVisible();
    await expect(page.getByText('← Retour au site')).toBeVisible();
    
    // Check password toggle exists
    const toggleButton = page.locator('button').filter({ has: page.locator('svg.lucide-eye, svg.lucide-eye-off') });
    await expect(toggleButton).toBeAttached();
  });

  test('signup page is fully functional', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Check form elements
    await expect(page.getByLabel('Nom complet')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer mon compte' })).toBeVisible();
    
    // Check links
    await expect(page.getByRole('link', { name: 'Se connecter' })).toBeVisible();
    
    // Check password toggle exists
    const toggleButton = page.locator('button').filter({ has: page.locator('svg.lucide-eye, svg.lucide-eye-off') });
    await expect(toggleButton).toBeAttached();
  });

  test('verify page loads without error', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');
    
    // Page should load without crashing
    await page.waitForTimeout(1000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Functional - Protected Routes', () => {
  test('portal redirects to login', async ({ page }) => {
    await page.goto('/portal');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('admin redirects when not logged in', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url.includes('/auth/login') || url.includes('/portal')).toBeTruthy();
  });
});

test.describe('Functional - Error Handling', () => {
  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-12345');
    await expect(page.getByText('Page non trouvée')).toBeVisible();
  });
});
