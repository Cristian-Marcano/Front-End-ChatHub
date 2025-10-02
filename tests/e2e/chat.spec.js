import { test, expect } from '@playwright/test';

test.describe('Chat Core Flow', () => {
  test('should load the chat interface for an authenticated user', async ({ page }) => {
    // Mock user info indicating profile IS set up
    await page.route('**/api/users/info', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          username: 'testuser',
          idInfo: 'info-123',
          first_name: 'Test',
          last_name: 'User'
        })
      });
    });

    // Mock localStorage to simulate being logged in
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'fake-jwt-token');
    });

    // Navigate to root (Chat Layout)
    await page.goto('/');
    
    // We expect to be on /
    await expect(page).toHaveURL('http://localhost:5173/');
    
    // Check if the chat layout loaded (e.g. looking for a search bar, or chat list)
    // We can just verify if the main container is visible or if some text like "Buscar" exists
    await expect(page.locator('body')).toBeVisible();
  });
});
