import {test, expect} from '@playwright/test';

const chapter = '/stops/the-deal-breaks/';

test('the board steps through its beats as the reading scrolls, and markers light up their actor', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto(chapter);
  const board = page.locator('.actor-board');
  await expect(board).toHaveAttribute('data-live', '');
  await expect(page.locator('.board-beat[data-active]')).toHaveAttribute('data-beat', 'intro');
  await page.evaluate(() => document.getElementById('record')!.scrollIntoView());
  await expect(page.locator('.board-beat[data-active]')).toHaveAttribute('data-beat', 'record');
  await page.evaluate(() => document.getElementById('metagame')!.scrollIntoView());
  await expect(page.locator('.board-beat[data-active]')).toHaveAttribute('data-beat', 'metagame');
  await expect(page.locator('.board-beat[data-active] .board-field-bearingCosts')).toBeVisible();
  await expect(page.locator('.board-actor[data-emphasis]')).toHaveCount(1);
  // A phrase in the text highlights its actor and says so politely; leaving clears it.
  const marker = page.getByRole('button', {name: 'Demanding secrecy did not guarantee secrecy'});
  await marker.focus();
  await expect(page.locator('.board-actor[data-actor="Captors"]')).toHaveAttribute('data-highlight', '');
  await expect(page.locator('#live-announcer')).toContainText('Captors:');
  await marker.blur();
  await expect(page.locator('.board-actor[data-highlight]')).toHaveCount(0);
  // An actor the text points at is a button that jumps to the phrase.
  await page.getByRole('button', {name: /Captors.*Find Captors in the text/}).click();
  await expect(page.locator('.text-marker[data-marker-actor="Captors"]:focus')).toHaveCount(1);
});

test('every chapter pins its board and steps it through three beats', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  for (const id of ['the-arrangement', 'a-suite-above-the-street', 'under-the-bluff', 'the-price-of-protection', 'the-deal-breaks', 'the-safe-house-fails', 'on-the-record']) {
    await page.goto(`/stops/${id}/`);
    await expect(page.locator('.actor-board'), id).toHaveAttribute('data-live', '');
    await expect(page.locator('.popup'), id).toHaveCount(0);
    await expect(page.locator('.board-actor-body'), id).toHaveCount(3);
    for (const block of ['intro', 'record', 'metagame']) {
      await page.evaluate(b => document.getElementById(b)!.scrollIntoView(), block);
      await expect(page.locator('.board-beat[data-active]'), `${id} ${block}`).toHaveAttribute('data-beat', block);
    }
    const box = await page.locator('.actor-board').boundingBox();
    expect(box!.y + box!.height, `${id} fits the viewport`).toBeLessThanOrEqual(900);
  }
});

test('without scripting or on a narrow screen the whole board is stacked and readable', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false, viewport: {width: 320, height: 800}});
  const page = await context.newPage();
  await page.goto(chapter);
  await expect(page.locator('.board-beat')).toHaveCount(3);
  await expect(page.locator('.board-beat:visible')).toHaveCount(3);
  await expect(page.locator('.actor-board button')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
  const narrow = await browser.newPage({viewport: {width: 390, height: 844}});
  await narrow.goto(chapter);
  await expect(narrow.locator('.actor-board[data-live]')).toHaveCount(0);
  await expect(narrow.locator('.board-beat:visible')).toHaveCount(3);
  await narrow.close();
});
