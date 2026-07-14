import { test, expect } from '@playwright/test';

test.describe('Admin Post CRUD & Publishing', () => {
  // Admin credentials should ideally be seeded in a global setup,
  // but for the sake of the test we'll assume an admin exists or we mock it.
  
  test('Admin can create, edit, and publish a post', async ({ page }) => {
    // 1. Admin logs in
    await page.goto('/login');
    // We assume 'admin@test.com' is seeded
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'adminpass');
    await page.click('button[type="submit"]');

    // 2. Navigate to Admin Dashboard or Create Post page
    await page.goto('/admin/posts/new');

    // 3. Create a draft post
    const postTitle = `E2E Test Post ${Date.now()}`;
    await page.fill('input[name="title"]', postTitle);
    await page.fill('textarea[name="content"], .toastui-editor-contents', 'This is an E2E test post content.'); // Adjust selector based on actual editor
    await page.click('button:has-text("Save Draft")');

    await expect(page).toHaveURL(/.*\/admin\/posts/);
    
    // 4. Edit and publish
    await page.click(`text=${postTitle}`);
    await page.click('button:has-text("Publish")');

    // 5. Verify it appears on the home page
    await page.goto('/');
    await expect(page.locator(`text=${postTitle}`)).toBeVisible();
  });
});
