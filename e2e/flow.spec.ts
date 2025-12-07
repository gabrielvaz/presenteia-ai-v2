
import { test, expect } from '@playwright/test';

test.describe('Gift-AI User Flow', () => {
  
  test('Happy Path: Analysis to Results', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/Presente\.AI/i);
    
    // Check Hero text
    await expect(page.getByText('O presente perfeito começa pelo Instagram')).toBeVisible();

    // Fill Input
    const input = page.getByPlaceholder('seu_instagram');
    await input.fill('gabrielvaz'); // Auto-adds @ logic tested manually, here just flow

    // Click Analyze
    await page.getByRole('button', { name: /Analisar/i }).click();

    // 2. Wizard
    await page.waitForURL('**/wizard');
    
    
    // Answer Questions (Simulate clicks)
    // Step 1: Relationship
    await page.getByText('Amizade').click();
    
    // Step 2: Occasion
    await page.getByText('Aniversário').click();
    
    // Step 3: Price
    await page.getByText('R$100 - R$200').click();
    
    // Step 4: Interests
    await page.getByText('Tecnologia').click();
    await page.getByText('Viagens').click(); // Select multiple
    
    // Complete
    await page.getByRole('button', { name: /Concluir/i }).click();

    // 3. Results
    await page.waitForURL('**/results');
    
    // Loading Screen (wait for text or element)
    // It stays on loading until checks pass (30s max or less if mock)
    // We expect "Encontramos presentes" eventually.
    // Given the 30s logic, we should increase timeout for this assertion if needed.
    await expect(page.getByText('Encontramos presentes incríveis!')).toBeVisible({ timeout: 40000 });

    // 4. Products
    // Check if cards exist
    const cards = page.locator('.group'); // ProductCard class identifier
    await expect(cards.first()).toBeVisible();
    
    // Check Affiliate Link
    const link = cards.first().getByRole('link', { name: /Ver na Amazon/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /tag=presentaiaai-20/);
  });

  test('Catalog Screen: Filters and Pagination', async ({ page }) => {
      await page.goto('/'); // Catalog is on home now
      
      const catalogSection = page.locator('#catalog');
      await catalogSection.scrollIntoViewIfNeeded();
      
      // Check Filter
      await page.getByRole('combobox').filter({ hasText: 'Categoria' }).click();
      await page.getByLabel('Tecnologia').click();
      
      // Wait for update (loading spinner or change)
      await page.waitForTimeout(2000); 

      // Verify items loaded
      const productCards = page.locator('#catalog .group');
      const count = await productCards.count();
      expect(count).toBeGreaterThan(0);
  });

});
