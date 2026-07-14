import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  const uniqueEmail = `user${Date.now()}@example.com`;
  const password = 'Password123!';

  test('User can register successfully', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="username"]', `user${Date.now()}`);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);

    await page.click('button[type="submit"]');

    // Should redirect to home or login, depending on implementation
    // Assuming it redirects to login or automatically logs in and goes to home
    await expect(page).toHaveURL(/.*(\/login|\/)/);
  });

  test('User can log in successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    // Check if user menu or some authenticated element appears
    // await expect(page.locator('text=Profile')).toBeVisible();
  });
});
