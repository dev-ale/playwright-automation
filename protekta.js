import { test, expect } from '@playwright/test';
import {chromium} from "playwright";

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

(async () => {
  // Launch Chromium in headful mode
  const browser = await chromium.launch({
    headless: false,  // Run browser in headful mode
    //slowMo: 200        // Slow down operations to view them
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://www.protekta.ch/de');
  await page.getByRole('button', { name: 'Alle Cookies akzeptieren' }).click();
  await page.getByRole('button', { name: 'Angebote berechnen' }).click();
  await page.locator('#cdk-overlay-0').getByRole('img', { name: 'Protekta Privat-Rechtsschutz' }).click();
  await page.locator('mobi-tile').filter({ hasText: 'Rechtsschutz für Private' }).getByRole('link').click();
  await page.getByPlaceholder('TT.MM.JJJJ').click();
  await page.getByPlaceholder('TT.MM.JJJJ').fill('10.03.1991');
  await page.getByPlaceholder('Postleitzahl oder Ort').click();
  await page.getByPlaceholder('Postleitzahl oder Ort').fill('4055');
  await page.getByRole('option', { name: 'Basel' }).click();
  await page.locator('[data-test="submitbutton"]').click();
  await page.locator('[data-test="auswaehlen_MINIMA"]').click();
  await page.getByText('Herr').click();
  await page.getByLabel('Vorname').click();
  await page.getByLabel('Vorname').fill('Test');
  await page.getByLabel('Vorname').press('Tab');
  await page.getByLabel('Name', { exact: true }).fill('Mobi');
  await page.getByLabel('Typeahead').click();
  await page.getByLabel('Typeahead').fill('Spale');
  await page.getByRole('option', { name: 'Spalenring' }).click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByLabel('', { exact: true }).fill('77');
  await page.getByLabel('E-Mail-Adresse').click();
  await page.getByLabel('E-Mail-Adresse').fill('test@mobi.ch');
  await page.getByLabel('Telefonnummer').click();
  await page.getByLabel('Telefonnummer').fill('0790000000');
  await page.getByLabel('Zivilstand').click();
  await page.getByRole('option', { name: 'ledig' }).click();
  await page.getByLabel('Berufliche Situation').click();
  await page.getByRole('option', { name: 'angestellt' }).click();
  await page.locator('[data-test="submitbutton"]').click();
  await page.getByText('Nein', { exact: true }).click();
  await page.locator('[data-test="submitbutton"]').click();

  // leave the browser open
  await new Promise(() => {});

})();