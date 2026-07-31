import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 768, 1440]) {
  test(`navigation et filtres à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/correspondances/');
    await page.getByLabel('Rechercher AWS ou GCP').fill('Spanner');
    await expect(page.locator('[data-results]')).toContainText('Spanner');
    await page.goto('/modele-mental/');
    await page.getByRole('button', { name: 'Détaillée' }).click();
    await expect(page.locator('.details-only')).toBeVisible();
    await page.goto('/iam/'); await expect(page).toHaveURL(/iam/);
  });
}
test('pages prioritaires sans violation axe sérieuse', async ({ page }) => {
  for (const path of ['/', '/iam/', '/reseau/', '/correspondances/', '/architectures/']) {
    await page.goto(path); const report = await new AxeBuilder({ page }).analyze();
    expect(report.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? '')).map((v) => v.id)).toEqual([]);
  }
});

test('diagrammes Mermaid rendus sans erreur de syntaxe', async ({ page }) => {
  const diagramPages = [
    ['/organisation/', 2],
    ['/iam/', 1],
    ['/reseau/', 1],
    ['/messaging/', 1],
    ['/data-ia/', 1],
    ['/securite/', 1],
    ['/resilience/', 1],
    ['/architectures/', 4],
  ] as const;

  for (const [path, expectedCount] of diagramPages) {
    await page.goto(path);
    await expect(page.locator('.mermaid svg')).toHaveCount(expectedCount);
    await expect(page.getByText('Syntax error in text', { exact: false })).toHaveCount(0);
  }
});
