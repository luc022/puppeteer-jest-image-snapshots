const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });


describe('Visual Regression Tesing', () => {
    let browser;
    let page;

    beforeAll(async function() {
        browser = await puppeteer.launch({
            headless: true            
        });
        page = await browser.newPage();
    });

    afterAll(async function() {
        await browser.close();
    });

    test('Full Page Snapshot', async function() {
        await page.goto('http://example.com/');
        await page.waitForSelector('h1');
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureTresholdType: 'pixel',
            failureThreshold: 500,
        });
    });

    test('Single element snapshot', async function() {
        await page.goto('http://example.com/');
        const h1 = await page.waitForSelector('h1');
        const image = await h1.screenshot();
        expect(image).toMatchImageSnapshot({
            failureTresholdType: 'percent',
            failureThreshold: 0.01,
        });
    });

    test('Mobile snapshot', async function() {
        await page.goto('http://example.com/');
        await page.waitForSelector('h1');
        await page.emulate(puppeteer.devices['iPhone X']);
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureTresholdType: 'percent',
            failureThreshold: 0.01,
        }); 
    });

    test('Tablet snapshot', async function() {
        await page.goto('http://example.com/');
        await page.waitForSelector('h1');
        await page.emulate(puppeteer.devices['iPad landscape']);
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            failureTresholdType: 'percent',
            failureThreshold: 0.01,
        }); 
    });

    test.only('Remove Element Before Snapshot', async function() {
        await page.goto('http://example.com/');
        await page.evaluate(() => {
            (document.querySelectorAll('h1') || []).forEach(element => element.remove());
        });
        await page.waitForTimeout(5000);
    });

 });