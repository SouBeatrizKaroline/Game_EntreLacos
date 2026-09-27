import { test, expect } from '@playwright/test';

for (const [index, ending] of ['Conexão e Escuta Protegida', 'Limite Firme e Reparado', 'Obediência sob Tensão'].entries()) {
  test(`capítulo completo: ${ending}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.getByRole('button', { name: 'Nova história', exact: true }).click();
    for (let step = 0; step < 7; step++) {
      await page.getByRole('group', { name: 'Opções de resposta' }).getByRole('button').first().click();
    }
    await expect(page.getByRole('dialog')).toBeVisible();
    const before = await page.evaluate(() => localStorage.getItem('entre_lacos_save_v1'));
    await page.keyboard.press('1');
    expect(await page.evaluate(() => localStorage.getItem('entre_lacos_save_v1'))).toBe(before);
    await page.getByRole('button', { name: 'Entendido, voltar ao jogo' }).click();
    await page.getByRole('group', { name: 'Opções de resposta' }).getByRole('button').nth(index).click();
    await page.getByRole('group', { name: 'Opções de resposta' }).getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'Reflexão do Capítulo' })).toBeVisible();
    await expect(page.getByText(`Desfecho: ${ending}`, { exact: false })).toBeVisible();
    await page.reload();
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Reflexão do Capítulo' })).toBeVisible();
    await page.getByRole('button', { name: 'Experimentar outras escolhas' }).click();
    await expect(page.getByRole('button', { name: /Aguardar a resposta do outro lado/ })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('revela texto, retoma progresso e aplica acessibilidade no celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Nova história', exact: true }).click();
  await page.getByRole('button', { name: 'Exibir texto completo imediatamente' }).click();
  const dialogue = page.locator('span[aria-hidden="true"]').filter({ hasText: 'Lia? Cheguei' });
  const fullText = await dialogue.textContent();
  await page.waitForTimeout(150);
  expect(await dialogue.textContent()).toBe(fullText);
  await page.keyboard.press('1');
  await page.reload();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.getByRole('button', { name: /Girar a maçaneta/ })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir opções de acessibilidade e configurações' }).click();
  await page.getByRole('button', { name: 'Máximo', exact: true }).click();
  await page.getByRole('switch').first().click();
  await page.getByRole('button', { name: 'Salvar e fechar' }).click();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('20.8px');
  expect(await page.locator('main').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(0, 0, 0)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('save corrompido não impede iniciar', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('entre_lacos_save_v1', '{broken'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Nova história', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Opções de resposta' })).toBeVisible();
});
