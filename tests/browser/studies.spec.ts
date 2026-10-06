import {test, expect} from '@playwright/test';

const routes = ['change-the-question', 'read-between-the-lines', 'across-two-windows', 'a-change-in-listening', 'return-to-the-opening', 'two-scales-of-time'];

test('all six studies have working selection, sources and a complete reading view', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width: 320, height: 844});
  await page.goto('/studies/');
  await expect(page.locator('[data-study-card]')).toHaveCount(6);
  for (const route of routes) {
    await page.goto(`/studies/${route}/`);
    await expect(page.locator('[data-study]')).toHaveAttribute('data-enhanced', 'true');
    const last = page.locator('[data-study-select]').last();
    await last.click();
    await expect(last).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-study-frame]:visible')).toHaveCount(1);
    await expect(page.locator('[data-study-frame]:visible .claim-links a').first()).toBeVisible();
    await page.getByRole('button', {name: 'Read all views', exact: true}).click();
    await expect(page.locator('[data-study-frame]:visible')).toHaveCount(await page.locator('[data-study-frame]').count());
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('all six retain complete text and ordinary navigation without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false, viewport: {width: 320, height: 844}});
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`/studies/${route}/`);
    await expect(page.locator('[data-study-controls]')).toBeHidden();
    expect(await page.locator('[data-study-frame]:visible').count()).toBeGreaterThan(1);
    await expect(page.getByRole('link', {name: 'All six studies', exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await context.close();
});

test('paired windows synchronize known views and leave an independent study alone', async ({page, context}) => {
  await page.goto('/studies/across-two-windows/');
  const other = await context.newPage();
  await other.goto((await page.locator('[data-study-companion]').getAttribute('href'))!);
  const independent = await context.newPage();
  await independent.goto('/studies/across-two-windows/');
  await page.getByRole('button', {name: 'Follow the influence', exact: true}).click();
  await expect(other.locator('[data-study-select="influence"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(independent.locator('[data-study-select="tax"]')).toHaveAttribute('aria-pressed', 'true');
  await other.getByRole('button', {name: 'Follow the finances', exact: true}).click();
  await expect(page.locator('[data-study-select="tax"]')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    const room = new URL(location.href).searchParams.get('room');
    const revision = (document.querySelector('[data-study]') as HTMLElement).dataset.revision;
    const channel = new BroadcastChannel(`stp-study:/:${revision}:${room}`);
    channel.postMessage({type: 'select', frame: '<img onerror=alert(1)>'});
    channel.close();
  });
  await expect(other.locator('[data-study-select="tax"]')).toHaveAttribute('aria-pressed', 'true');
});

test('selections resume, while blocked storage and unsupported APIs keep reading usable', async ({page, context}) => {
  await page.goto('/studies/return-to-the-opening/');
  await page.getByRole('button', {name: 'Revisit the opening', exact: true}).click();
  await page.goto('/studies/');
  await expect(page.locator('[data-study-card="return-to-the-opening"] [data-study-resume]')).toContainText('Revisit the opening');
  await page.goto('/studies/return-to-the-opening/');
  await expect(page.locator('[data-study-select="return"]')).toHaveAttribute('aria-pressed', 'true');
  const fallback = await context.newPage();
  await fallback.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {get() { throw new Error('Unavailable'); }});
    Object.defineProperty(document, 'startViewTransition', {value: undefined});
    Object.defineProperty(window, 'BroadcastChannel', {value: undefined});
    Object.defineProperty(window, 'Highlight', {value: undefined});
  });
  await fallback.goto('/studies/read-between-the-lines/');
  await expect(fallback.locator('[data-study-saving]')).toContainText('temporary');
  await fallback.getByRole('button', {name: 'The boundary', exact: true}).click();
  await expect(fallback.locator('[data-highlight-notice]')).toBeVisible();
  await expect(fallback.locator('#frame-limits')).toBeVisible();
  await fallback.goto('/studies/across-two-windows/');
  await expect(fallback.locator('[data-study-companion]')).toBeHidden();
  await expect(fallback.locator('#frame-tax [data-window-pane="record"]')).toBeVisible();
});

test('Calm and reduced motion cancel effects; sound waits for an explicit start', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/studies/two-scales-of-time/');
  await page.getByRole('button', {name: 'Widen the view', exact: true}).click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  const requests: string[] = [];
  page.on('request', request => {if (request.url().includes('/media/audio/')) requests.push(request.url());});
  await page.goto('/studies/a-change-in-listening/');
  await page.getByRole('button', {name: 'The room', exact: true}).click();
  await page.getByRole('button', {name: 'Read all views', exact: true}).click();
  expect(requests).toEqual([]);
  await page.getByRole('button', {name: 'The account', exact: true}).click();
  await page.getByRole('button', {name: 'Start sound', exact: true}).click();
  await expect(page.locator('[data-sound-status]')).toContainText('Narration only');
  expect(requests.some(url => url.includes('ambience'))).toBe(false);
  await page.getByRole('button', {name: 'The street', exact: true}).click();
  await expect(page.locator('[data-sound-status]')).toContainText('Perspective selected');
  await page.getByRole('button', {name: 'Calm view', exact: true}).click();
  await page.getByRole('button', {name: 'Start sound', exact: true}).click();
  await expect(page.locator('[data-sound-status]')).toContainText('Narration only');
  expect(requests.some(url => url.includes('ambience'))).toBe(false);
});
