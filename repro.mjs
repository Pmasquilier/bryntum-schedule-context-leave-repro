// Hovers the first day of the first row, then leaves the time axis three ways and reads the context after each.
//
//   npm run dev        # in one terminal
//   npm run repro      # in another
import { chromium } from 'playwright-core';

const URL = process.env.REPRO_URL ?? 'http://localhost:5193/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport : { width : 1280, height : 600 } });
await page.goto(URL);
const row = page.locator('.b-grid-sub-grid-normal .b-grid-row').first();
await row.waitFor({ timeout : 60_000 });

const axis = await page.locator('.b-grid-sub-grid-normal').boundingBox();
const rowBox = await row.boundingBox();
const lastRow = await page.locator('.b-grid-sub-grid-normal .b-grid-row').last().boundingBox();
const y = rowBox.y + rowBox.height / 2;
const context = () => page.evaluate(() => {
    const tick = document.querySelector('.b-schedule-selected-tick');
    return Boolean(tick) && getComputedStyle(tick).display !== 'none' && tick.offsetWidth > 0;
});

const exits = {
    'left, onto the locked grid' : [axis.x - 60, y],
    'down, below the last row'   : [axis.x + 30, lastRow.y + lastRow.height + 40],
    'up, onto the header'        : [axis.x + 30, axis.y - 20],
    'out of the scheduler'       : [axis.x + 600, 10]
};

const results = {};
for (const [name, [toX, toY]] of Object.entries(exits)) {
    await page.mouse.move(axis.x + 200, y);
    await page.mouse.move(axis.x + 30, name.startsWith('down') ? lastRow.y + lastRow.height / 2 : y, { steps : 5 });
    await page.waitForTimeout(150);
    const hovered = await context();
    await page.mouse.move(toX, toY, { steps : 5 });
    await page.waitForTimeout(300);
    results[name] = { contextWhileHovering : hovered, contextAfterLeaving : await context() };
    if (name.startsWith('left')) {
        await page.screenshot({ path : 'after-leaving-left.png' });
    }
}

console.table(results);
const reproduced = results['left, onto the locked grid'].contextAfterLeaving;
console.log(reproduced ? 'reproduced' : 'not reproduced');
await browser.close();
process.exit(reproduced ? 0 : 1);
