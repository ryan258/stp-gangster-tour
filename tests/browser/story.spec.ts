import {test, expect} from '@playwright/test';

const chapters = [
  ['the-arrangement', 'threshold'],
  ['a-suite-above-the-street', 'ledger'],
  ['under-the-bluff', 'chair'],
  ['the-price-of-protection', 'letter'],
  ['the-deal-breaks', 'telephone'],
  ['the-safe-house-fails', 'doorway'],
  ['on-the-record', 'docket'],
] as const;

const featuredScenes = [
  {
    id: 'the-arrangement',
    feature: 'threshold',
    art: 'story-doorway',
    inspect: 'Inspect the conditions',
    reveal: 'Keep major crimes outside',
    payoff: /Who was outside the bargain\?/i,
    reprise: 'Return to the doorway',
    takeaway: 'Refuge had a boundary.',
    sources: [
      {label: 'Sources for the conditions', id: 'E01'},
      {label: 'Sources for the intermediaries', id: 'E02'},
    ],
  },
  {
    id: 'the-deal-breaks',
    feature: 'telephone',
    art: 'story-the-deal-breaks',
    inspect: 'Read the demand',
    reveal: 'Read the reported response',
    payoff: /local and federal authorities/i,
    reprise: 'Return to the telephone',
    takeaway: 'The line stayed open.',
    sources: [{label: 'Source for the demand and response', id: 'E09'}],
  },
] as const;

test('each opening uses one backdrop before sourced evidence and a cut-paper return', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/');
  await page.getByRole('link', {name: 'Enter the story', exact: true}).click();
  await expect(page).toHaveURL('/#story-opening');
  await expect(page.locator('[data-title-sequence]')).toHaveCount(chapters.length);

  for (const [id, symbol] of chapters) {
    await test.step(id, async () => {
      const sequence = page.locator(`[data-title-sequence="${id}"]`);
      const opening = sequence.locator('[data-title-beat="opening"]');
      const record = sequence.locator('[data-title-beat="record"]');
      const reprise = sequence.locator('[data-title-beat="return"]');
      const featured = featuredScenes.find(scene => scene.id === id);
      const first = opening.locator('[data-title-symbol]');
      const last = reprise.locator('[data-title-symbol]');
      const art = featured?.art ?? `story-${id}`;
      await expect(opening.locator('figure.title-scene-art img')).toHaveAttribute('src', `/images/redesign/${art}.webp`);
      await expect(sequence.locator('figure.title-scene-art img')).toHaveCount(1);
      await expect(last).toHaveAttribute('data-title-symbol', symbol);
      if (featured) {
        await expect(sequence).toHaveAttribute('data-title-feature', featured.feature);
        const narration = opening.getByRole('link', {name: 'Go to chapter narration'});
        await expect(narration).toHaveAttribute('href', `/stops/${id}/#chapter-narration`);
      } else {
        await expect(first).toHaveAttribute('data-title-symbol', symbol);
        const label = await first.getAttribute('aria-label');
        expect(label?.trim()).toBeTruthy();
        await expect(last).toHaveAttribute('aria-label', label!);
        await expect(first.locator('[data-title-piece]')).toHaveCount(3);
        const contours = await first.locator('[data-title-piece]').evaluateAll(pieces =>
          pieces.map(piece => getComputedStyle(piece).clipPath)
        );
        expect(contours.some(contour => contour !== 'none')).toBe(true);
        expect(await last.locator('[data-title-piece]').evaluateAll(pieces =>
          pieces.map(piece => getComputedStyle(piece).clipPath)
        )).toEqual(contours);
      }

      await opening.getByRole('link', {name: featured?.inspect ?? 'Inspect the record'}).click();
      await expect(page).toHaveURL(`/#scene-${id}-record`);
      await expect(record.getByRole('heading').first()).toBeInViewport();
      const sourceLinks = record.locator('a[href*="#evidence-"]');
      expect(await sourceLinks.count()).toBeGreaterThan(0);
      for (const href of await sourceLinks.evaluateAll(links => links.map(link => link.getAttribute('href')))) {
        expect(href).toMatch(new RegExp(`^/stops/${id}/#evidence-E\\d{2}$`));
      }
      const returnLabel = featured?.reprise ?? (id === 'under-the-bluff' ? 'Return to the chair' : 'Return to the symbol');
      await record.getByRole('link', {name: returnLabel}).click();
      await expect(page).toHaveURL(`/#scene-${id}-return`);
      if (featured) {
        await expect(reprise.getByRole('heading', {name: featured.takeaway})).toBeVisible();
        await expect(last).toBeVisible();
      } else {
        await expect(last).toBeInViewport();
      }
    });
  }
  await page.locator('[data-title-sequence="on-the-record"]').getByRole('link', {name: 'Go to the epilogue'}).click();
  await expect(page).toHaveURL('/#story-coda');
  await page.getByRole('link', {name: 'Read the epilogue', exact: true}).click();
  await expect(page).toHaveURL('/epilogue/');
});

test('Calm view and live system preferences stop decorative story motion', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      const animation = animate.call(this, keyframes, options);
      // Keep the short title cuts pending long enough to exercise cancellation.
      if (this.matches('[data-title-piece]')) animation.pause();
      return animation;
    };
  });
  await page.setViewportSize({width: 1440, height: 900});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('/');
  const story = page.locator('[data-story-root]');
  const calm = page.getByRole('button', {name: 'Calm view', exact: true});
  await expect(story).toHaveAttribute('data-story-motion', 'active');

  await page.getByRole('link', {name: 'Enter the story', exact: true}).click();
  const firstSymbol = story.locator('[data-title-sequence="a-suite-above-the-street"] [data-title-beat="opening"] [data-title-symbol]');
  await firstSymbol.scrollIntoViewIfNeeded();
  await expect.poll(() => firstSymbol.evaluate(symbol => symbol.getAnimations({subtree: true}).length)).toBeGreaterThan(0);
  await calm.click();
  await expect(story).toHaveAttribute('data-story-motion', 'still');
  await expect(calm).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => story.locator('[data-title-piece]').evaluateAll(pieces => pieces.every(piece =>
    piece.getAnimations().length === 0 && getComputedStyle(piece).transform === 'none'
  ))).toBe(true);

  await calm.click();
  await expect(story).toHaveAttribute('data-story-motion', 'active');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(story).toHaveAttribute('data-story-motion', 'still');
  await page.emulateMedia({reducedMotion: 'no-preference', media: 'print'});
  await expect(story).toHaveAttribute('data-story-motion', 'still');
  await page.emulateMedia({media: 'screen'});
  await expect(story).toHaveAttribute('data-story-motion', 'active');
  expect(errors).toEqual([]);
});

test('both illustrated evidence turns work with Calm view and keyboard at tablet width', async ({page}) => {
  await page.setViewportSize({width: 768, height: 1024});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  const calm = page.getByRole('button', {name: 'Calm view', exact: true});

  for (const featured of featuredScenes) {
    await test.step(featured.id, async () => {
      const route = `/stops/${featured.id}/`;
      await page.goto(route);
      if (featured.feature === 'threshold') await calm.click();
      await expect(calm).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('html')).toHaveClass(/calm-mode/);

      const opening = page.locator('#sequence-opening');
      const inspect = opening.getByRole('link', {name: featured.inspect});
      await inspect.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`${route}#sequence-record`);

      const record = page.locator('#sequence-record');
      const reveal = record.locator('details').filter({
        has: page.locator('summary').filter({hasText: featured.reveal}),
      });
      const summary = reveal.locator('summary');
      const extendedLine = record.locator('.title-scene-line span').last();
      const demand = record.locator('.title-scene-demand');
      await expect(reveal).toHaveJSProperty('open', false);
      await expect(reveal.getByText(featured.payoff)).toBeHidden();
      await expect(extendedLine).not.toHaveCSS('transform', 'none');
      if (featured.feature === 'telephone') {
        await expect(demand).toBeVisible();
        await expect(demand).toContainText('$200,000');
      }
      expect(await summary.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(summary).toBeFocused();
      await expect(reveal.getByText(featured.payoff)).toBeVisible();
      if (featured.feature === 'telephone') await expect(demand).toBeVisible();
      await expect(extendedLine).toHaveCSS('transform', 'none');
      expect(await record.locator('.title-scene-line').evaluate(line =>
        line.getAnimations({subtree: true}).length
      )).toBe(0);

      for (const source of featured.sources) {
        const sourceDisclosure = record.locator('details').filter({
          has: page.locator('summary').filter({hasText: source.label}),
        });
        await sourceDisclosure.locator('summary').click();
        await expect(sourceDisclosure.locator(`a[href$="#evidence-${source.id}"]`)).toBeVisible();
      }
      await record.getByRole('link', {name: featured.reprise}).click();
      await expect(page).toHaveURL(`${route}#sequence-return`);
      await expect(page.locator('#sequence-return').getByRole('heading', {name: featured.takeaway})).toBeVisible();

      const narration = page.locator('#chapter-narration');
      await expect(narration.getByRole('button', {name: 'Play narration'})).toBeVisible();
      const player = narration.locator('[data-audio-player]');
      await expect(page.locator('[data-audio-player]')).toHaveCount(1);
      await expect(player).toHaveAttribute('data-narration-src', `/media/audio/narr-${featured.id}.mp3`);
      await expect(narration.getByRole('link', {name: 'Read the introduction transcript'})).toHaveAttribute('href', '#intro');
      await expect(page.locator('#intro')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
});

test('phone chapter navigation keeps the record, the full chapter and a resume link within reach', async ({page}) => {
  await page.setViewportSize({width: 320, height: 844});
  await page.goto('/');
  const chapter = page.getByRole('navigation', {name: 'Story chapters'}).getByRole('link', {name: 'Chapter 05: The Deal Breaks'});
  await chapter.click();
  await expect(page).toHaveURL('/#scene-the-deal-breaks');
  await expect(chapter).toHaveAttribute('aria-current', 'step');
  const sequence = page.locator('[data-title-sequence="the-deal-breaks"]');
  await sequence.getByRole('link', {name: 'Read the demand'}).click();
  await expect(page).toHaveURL('/#scene-the-deal-breaks-record');
  await expect(chapter).toHaveAttribute('aria-current', 'step');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await sequence.getByRole('link', {name: 'Look back at the opening'}).click();
  await sequence.locator('[data-title-beat="opening"]').getByRole('link', {name: 'Read the full chapter'}).click();
  await expect(page).toHaveURL('/stops/the-deal-breaks/#intro');
  await expect(page.getByRole('heading', {level: 1, name: 'The Deal Breaks'})).toBeVisible();
  await expect(page.locator('#sequence-opening .title-scene-art img')).toHaveAttribute('src', '/images/redesign/story-the-deal-breaks.webp');
  await page.locator('#sequence-opening').getByRole('link', {name: 'Read the demand'}).click();
  await expect(page).toHaveURL('/stops/the-deal-breaks/#sequence-record');
  await expect.poll(() => page.evaluate(() => {
    const saved = localStorage.getItem('stp-after-dark:progress:v1');
    return saved ? JSON.parse(saved).bookmark?.blockId : null;
  })).toBe('sequence-record');
  await page.goto('/');
  await expect(page.getByRole('link', {name: /Resume reading: The Deal Breaks/})).toHaveAttribute('href', '/stops/the-deal-breaks/#sequence-record');
});

test.describe('native story links without JavaScript', () => {
  test.use({javaScriptEnabled: false, viewport: {width: 320, height: 844}});

  test('opening, evidence, reprise and the next chapter remain readable', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('[data-title-sequence]')).toHaveCount(chapters.length);
    await expect(page.getByRole('button', {name: 'Calm view'})).toHaveCount(0);
    await expect(page.getByRole('button', {name: 'Play scene sound'})).toHaveCount(0);
    await page.getByRole('link', {name: 'Enter the story', exact: true}).click();
    await expect(page).toHaveURL('/#story-opening');
    const scene = page.locator('[data-title-sequence="the-arrangement"]');
    const opening = scene.locator('[data-title-beat="opening"]');
    await expect(opening.getByRole('img')).toBeVisible();
    await opening.getByRole('link', {name: 'Inspect the conditions'}).click();
    const record = scene.locator('[data-title-beat="record"]');
    await record.locator('summary').filter({hasText: 'Keep major crimes outside'}).click();
    await expect(record.getByText('Who was outside the bargain?')).toBeVisible();
    await record.locator('summary').filter({hasText: 'Sources for the conditions'}).click();
    await expect(record.locator('a[href$="#evidence-E01"]')).toBeVisible();
    await record.getByRole('link', {name: 'Return to the doorway'}).click();
    await expect(page).toHaveURL('/#scene-the-arrangement-return');
    await scene.getByRole('link', {name: 'Next chapter'}).click();
    await expect(page).toHaveURL('/#scene-a-suite-above-the-street');

    await page.goto('/stops/the-deal-breaks/#sequence-record');
    const telephone = page.locator('#sequence-record');
    const demand = telephone.locator('.title-scene-demand');
    await expect(demand).toBeVisible();
    await telephone.locator('summary').filter({hasText: 'Read the reported response'}).click();
    await expect(telephone.getByText(/local and federal authorities/i)).toBeVisible();
    await expect(demand).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});

test('a failed motion chunk leaves title sequences and the existing preferences usable', async ({page}) => {
  let blockedMotion = false;
  await page.route(/\/_astro\/story\.[^/]+\.js(?:\?.*)?$/, route => { blockedMotion = true; return route.abort(); });
  await page.goto('/');
  await expect.poll(() => blockedMotion).toBe(true);
  await expect(page.getByRole('heading', {name: 'Saint Paul After Dark', exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Calm view', exact: true}).click();
  await expect(page.locator('html')).toHaveClass(/calm-mode/);
  const scene = page.locator('[data-title-sequence="the-arrangement"]');
  await scene.getByRole('link', {name: 'Inspect the conditions'}).click();
  const record = scene.locator('[data-title-beat="record"]');
  await record.locator('summary').filter({hasText: 'Sources for the conditions'}).click();
  await expect(record.locator('a[href$="#evidence-E01"]')).toBeVisible();
});

test('cross-page cut carries the chapter title frame from the home story', async ({page}) => {
  await page.goto('./#scene-the-deal-breaks');
  const link = page.locator('[data-title-sequence="the-deal-breaks"] a.title-quiet[href*="#intro"]');
  await page.evaluate(() => addEventListener('pageswap', event => sessionStorage.setItem('cut', JSON.stringify({
    transition: !!event.viewTransition,
    tagged: [...document.querySelectorAll<HTMLElement>('[data-cut-target]')].map(el => el.dataset.titleSequence),
  }))));
  await link.click();
  await page.waitForURL(/\/stops\/the-deal-breaks\/#intro$/);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('cut')!))).toEqual({transition: true, tagged: ['the-deal-breaks']});
  await expect(page.locator('.title-frame-opening')).toHaveCSS('view-transition-name', 'chapter-frame');
});
