import {test, expect} from '@playwright/test';

test('story motion stops immediately for Calm view and a changed system preference', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width: 1440, height: 900});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('/');
  const story = page.locator('[data-story-root]');
  const calm = page.getByRole('button', {name: 'Calm view', exact: true});
  await expect(story).toHaveAttribute('data-story-motion', 'active');
  for (let cycle = 0; cycle < 2; cycle++) {
    await calm.click();
    await expect(story).toHaveAttribute('data-story-motion', 'still');
    // Hidden artwork cannot be left running or retain a committed transform.
    expect(await page.evaluate(() => document.getAnimations().filter(animation =>
      ((animation.effect as KeyframeEffect)?.target as Element)?.closest('[data-story-root]')
    ).length)).toBe(0);
    expect(await page.locator('[data-story-image]').evaluateAll(elements =>
      elements.every(element => (element as HTMLElement).style.transform === '')
    )).toBe(true);
    await calm.click();
    await expect(story).toHaveAttribute('data-story-motion', 'active');
  }
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(story).toHaveAttribute('data-story-motion', 'still');
  await calm.click();
  await calm.click();
  await expect(story).toHaveAttribute('data-story-motion', 'still');
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await expect(story).toHaveAttribute('data-story-motion', 'active');
  await page.emulateMedia({media: 'print'});
  await expect(story).toHaveAttribute('data-story-motion', 'still');
  await page.emulateMedia({media: 'screen'});
  await expect(story).toHaveAttribute('data-story-motion', 'active');
  expect(errors).toEqual([]);
});

test('chapter links work at phone width and the source drawer keeps its qualifications', async ({page}) => {
  await page.setViewportSize({width: 320, height: 844});
  await page.goto('/');
  const chapter = page.getByRole('navigation', {name: 'Story chapters'}).getByRole('link', {name: 'Chapter 03: Under the Bluff'});
  await chapter.click();
  await expect(page).toHaveURL(/#scene-under-the-bluff$/);
  await expect(chapter).toHaveAttribute('aria-current', 'step');
  const scene = page.locator('#scene-under-the-bluff');
  await scene.locator('summary').click();
  await expect(scene.locator('details')).toHaveAttribute('open', '');
  await expect(scene.locator('.claim-links a').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await scene.getByRole('link', {name: /Step inside this chapter/}).click();
  await expect(page).toHaveURL(/\/stops\/under-the-bluff\/$/);
  await expect(page.locator('#intro')).toContainText('The first evidence here is modest: a business notice.');
});

test('the complete story and its source disclosures work without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false, viewport: {width: 320, height: 844}});
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-story-scene]')).toHaveCount(7);
  await expect(page.getByRole('button', {name: 'Calm view'})).toHaveCount(0);
  await page.getByRole('link', {name: 'Enter the story', exact: true}).click();
  await expect(page).toHaveURL(/#story-opening$/);
  await page.locator('#scene-the-arrangement summary').click();
  await expect(page.locator('#scene-the-arrangement .claim-links a').first()).toBeVisible();
  await page.getByRole('link', {name: 'Read the epilogue', exact: true}).click();
  await expect(page).toHaveURL(/\/epilogue\/$/);
  await context.close();
});

test('a failed motion chunk leaves reading and the existing preferences usable', async ({page}) => {
  let blockedMotion = false;
  await page.route(/\/_astro\/story\.[^/]+\.js(?:\?.*)?$/, route => { blockedMotion = true; return route.abort(); });
  await page.goto('/');
  await expect.poll(() => blockedMotion).toBe(true);
  await expect(page.getByRole('heading', {name: 'Saint Paul After Dark', exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Calm view', exact: true}).click();
  await expect(page.locator('html')).toHaveClass(/calm-mode/);
  await page.locator('#scene-the-arrangement summary').click();
  await expect(page.locator('#scene-the-arrangement .claim-links a').first()).toBeVisible();
});
