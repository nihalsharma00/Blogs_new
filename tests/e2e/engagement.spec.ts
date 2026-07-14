import { test, expect } from '@playwright/test';

test.describe('Engagement Features', () => {
  test('User can like and bookmark a post', async ({ page }) => {
    // Navigate to a known post or home page
    await page.goto('/');
    
    // We assume the user is logged in, or we trigger the login modal 
    // depending on the UI implementation.
    
    // Find the first post link and click it
    const postLink = page.locator('article a').first();
    if (await postLink.isVisible()) {
        await postLink.click();
        
        // Test Like
        const likeButton = page.locator('button[aria-label="Like post"]');
        if (await likeButton.isVisible()) {
            await likeButton.click();
            // Expect state change (e.g. icon filled or text changed)
            await expect(likeButton).toHaveClass(/active|liked/);
        }

        // Test Bookmark
        const bookmarkButton = page.locator('button[aria-label="Bookmark post"]');
        if (await bookmarkButton.isVisible()) {
            await bookmarkButton.click();
            await expect(bookmarkButton).toHaveClass(/active|bookmarked/);
        }
    }
  });

  test('User can add a comment and reply', async ({ page }) => {
    await page.goto('/');
    const postLink = page.locator('article a').first();
    if (await postLink.isVisible()) {
        await postLink.click();

        // Add a comment
        const commentInput = page.locator('textarea[placeholder*="comment"]');
        if (await commentInput.isVisible()) {
            await commentInput.fill('This is a test comment from Playwright.');
            await page.click('button:has-text("Post Comment")');
            
            await expect(page.locator('text=This is a test comment from Playwright.')).toBeVisible();

            // Reply to the comment
            await page.click('button:has-text("Reply")');
            const replyInput = page.locator('textarea[placeholder*="reply"]');
            await replyInput.fill('This is a test reply.');
            await page.click('button:has-text("Post Reply")');

            await expect(page.locator('text=This is a test reply.')).toBeVisible();
        }
    }
  });
});
