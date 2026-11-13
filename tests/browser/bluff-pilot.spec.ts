import {expect, test, type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const chapter = '/stops/under-the-bluff/';

async function chairComposition(art: Locator) {
  return art.evaluate(element => {
    const chair = element.getBoundingClientRect();
    return {
      width: chair.width,
      height: chair.height,
      pieces: [...element.querySelectorAll('[data-title-piece]')].map(piece => getComputedStyle(piece).clipPath),
    };
  });
}

test('the record changes how the visitor reads the same chair shot and can resume at that beat', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto(chapter);
  await page.evaluate(async () => { await document.fonts.ready; });
  const room = page.locator('#bluff-room');
  const record = page.locator('#bluff-record');
  const returnBeat = page.locator('#bluff-return');
  await expect(room.getByText('Who sat here?', {exact: true})).toBeVisible();
  const firstShot = await chairComposition(room.locator('[data-title-symbol="chair"]'));
  expect(firstShot.pieces).toHaveLength(3);
  expect(firstShot.pieces.some(piece => piece.startsWith('polygon('))).toBe(true);

  const inspect = room.getByRole('link', {name: 'Inspect the record'});
  await inspect.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${chapter}#bluff-record`);
  await expect(record.getByRole('heading', {name: 'The business notice'})).toBeVisible();
  await expect(record.getByRole('heading', {name: 'The guest stories'})).toBeVisible();
  await expect(record).toContainText('Commercial West');
  await expect(record).toContainText('John Dillinger and Ma Barker unverified');
  await expect(record.getByRole('link', {name: 'Sources for the notice'})).toHaveAttribute('href', '#evidence-E05');
  await expect(record.getByRole('link', {name: 'Sources for the guest stories'})).toHaveAttribute('href', '#evidence-E06');
  await expect.poll(() => page.evaluate(() => {
    const saved = localStorage.getItem('stp-after-dark:progress:v1');
    return saved ? JSON.parse(saved).bookmark?.blockId : null;
  })).toBe('bluff-record');

  await page.goto('/');
  const resume = page.getByRole('link', {name: /Resume reading: Under the Bluff/});
  await expect(resume).toHaveAttribute('href', `${chapter}#bluff-record`);
  await resume.click();
  await expect(page).toHaveURL(`${chapter}#bluff-record`);

  await record.getByRole('link', {name: 'Return to the chair'}).click();
  await expect(page).toHaveURL(`${chapter}#bluff-return`);
  await expect(returnBeat.getByRole('heading', {name: 'The chair stays empty.'})).toBeVisible();
  expect(await chairComposition(returnBeat.locator('[data-title-symbol="chair"]'))).toEqual(firstShot);
  await returnBeat.getByRole('link', {name: 'Continue to the chapter'}).click();
  await expect(page).toHaveURL(`${chapter}#intro`);
});

test('scene sound is opt-in, stops for cuts and Calm view, and plays one track at a time', async ({page}) => {
  // Exercise the media lifecycle deterministically. Listening quality requires human review.
  await page.addInitScript(() => {
    const nativePlay = HTMLMediaElement.prototype.play;
    const nativePause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      if (!this.matches('[data-title-audio]')) return nativePlay.call(this);
      this.dataset.playing = 'true';
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function (this: HTMLMediaElement) {
      if (!this.matches('[data-title-audio]')) return nativePause.call(this);
      this.dataset.playing = 'false';
    };
  });
  const mediaRequests: string[] = [];
  page.on('request', request => {
    if (/\.(mp3|aiff)$/.test(new URL(request.url()).pathname)) mediaRequests.push(request.url());
  });
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto(chapter);
  const room = page.locator('#bluff-room');
  const audio = room.locator('audio');
  const play = room.getByRole('button', {name: 'Play scene sound'});
  const calm = page.getByRole('button', {name: 'Calm view', exact: true});
  await expect(play).toBeVisible();
  expect(await room.locator('[data-title-piece]').evaluateAll(pieces =>
    pieces.every(piece => getComputedStyle(piece).transform === 'none')
  )).toBe(true);
  expect(await audio.getAttribute('src')).toBeNull();
  expect(mediaRequests).toEqual([]);

  await play.click();
  await expect(audio).toHaveAttribute('src', /\/media\/audio\/ambience-room-tone\.mp3$/);
  await expect(audio).toHaveAttribute('data-playing', 'true');
  await expect(room.locator('[data-title-sound-status]')).toHaveText('Synthesized atmosphere is playing.');
  await room.getByRole('link', {name: 'Inspect the record'}).click();
  await expect(audio).toHaveAttribute('data-playing', 'false');
  await page.getByRole('link', {name: 'Look back at the opening'}).click();
  await expect(play).toBeVisible();
  await expect(audio).toHaveAttribute('data-playing', 'false');

  await play.click();
  await expect(audio).toHaveAttribute('data-playing', 'true');
  await calm.click();
  await expect(calm).toHaveAttribute('aria-pressed', 'true');
  await expect(play).toHaveAttribute('aria-disabled', 'true');
  await expect(play).toHaveAccessibleDescription('Calm view keeps scene sound off.');
  await expect(room.locator('[data-title-sound-status]')).toBeEmpty();
  await expect(audio).toHaveAttribute('data-playing', 'false');
  await room.getByRole('link', {name: 'Inspect the record'}).click();
  await expect(page).toHaveURL(`${chapter}#bluff-record`);
  await page.getByRole('link', {name: 'Return to the chair'}).click();
  await expect(page).toHaveURL(`${chapter}#bluff-return`);
  await calm.click();
  await expect(play).toHaveAttribute('aria-disabled', 'false');
  await expect(audio).toHaveAttribute('data-playing', 'false');

  await play.click();
  await expect(audio).toHaveAttribute('data-playing', 'true');
  // Dispatch without scrolling to the narration player, which would stop the scene track by itself.
  const mute = page.getByRole('button', {name: 'Mute all'});
  await mute.dispatchEvent('click');
  await expect(audio).toHaveAttribute('data-playing', 'false');
  await expect(mute).toHaveAttribute('aria-pressed', 'true');
  await play.click();
  await expect(audio).toHaveAttribute('data-playing', 'true');
  await expect(mute).toHaveAttribute('aria-pressed', 'false');

  await page.goto('/');
  const first = page.locator('[data-title-sequence="the-arrangement"]');
  const second = page.locator('[data-title-sequence="a-suite-above-the-street"]');
  await expect(page.locator('[data-title-audio][src]')).toHaveCount(0);
  await first.getByRole('button', {name: 'Play scene sound'}).click();
  await expect(first.locator('[data-title-audio]')).toHaveAttribute('data-playing', 'true');
  await second.getByRole('button', {name: 'Play scene sound'}).click();
  await expect(first.locator('[data-title-audio]')).toHaveAttribute('data-playing', 'false');
  await expect(second.locator('[data-title-audio]')).toHaveAttribute('data-playing', 'true');
  await expect(page.locator('[data-title-audio][data-playing="true"]')).toHaveCount(1);
});

test('all title palettes and the chapter controls are accessible at phone width', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  for (const route of ['/', chapter]) {
    await page.goto(route);
    await expect(page.getByRole('button', {name: 'Play scene sound'}).first()).toBeVisible();
    if (route === '/') {
      const enter = page.getByRole('link', {name: 'Enter the story', exact: true});
      await enter.focus();
      await enter.press('Enter');
      await expect(page.locator('#story-opening')).toBeFocused();
    }
    const undersized = await page.locator('.title-sequence :is(a, button, summary):visible').evaluateAll(controls =>
      controls.filter(control => {
        const {width, height} = control.getBoundingClientRect();
        return width < 44 || height < 44;
      }).map(control => control.textContent?.trim())
    );
    expect(undersized, route).toEqual([]);
    const results = await new AxeBuilder({page})
      .include('[data-title-sequence]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map(({id, nodes}) => `${id}: ${nodes.map(node => node.target.join(' ')).join(' | ')}`), route).toEqual([]);
  }
});

test.describe('the scene without JavaScript', () => {
  test.use({javaScriptEnabled: false, viewport: {width: 320, height: 844}, reducedMotion: 'reduce'});

  test('keeps the room, sources, return shot, and chapter available at phone width', async ({page}) => {
    await page.goto(chapter);
    await expect(page.getByText('Who sat here?', {exact: true})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Play scene sound'})).toHaveCount(0);
    await page.getByRole('link', {name: 'Inspect the record'}).click();
    await expect(page).toHaveURL(`${chapter}#bluff-record`);
    await expect(page.getByRole('heading', {name: 'What the record tells us'})).toBeVisible();
    await page.getByRole('link', {name: 'Return to the chair'}).click();
    await expect(page).toHaveURL(`${chapter}#bluff-return`);
    await expect(page.getByRole('heading', {name: 'The chair stays empty.'})).toBeVisible();
    await page.getByRole('link', {name: 'Continue to the chapter'}).click();
    await expect(page).toHaveURL(`${chapter}#intro`);
    await page.getByRole('link', {name: 'Sources for the notice'}).click();
    await expect(page).toHaveURL(`${chapter}#evidence-E05`);
    const notice = page.locator('#evidence-E05');
    await notice.locator('summary').click();
    await expect(notice.locator('.evidence-content')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
