import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { LAUNCH_OPTIONS, SIZES, CU_RU_ENDPOINT, BASE_OUTPUT_PATH, DEFAULT_CHARSET } from './consts';
import { writeCategoryData } from './utils/utils'

const NETWORK_BUFFER_SIZE_FIX_PARAMS = {
    maxResourceBufferSize: SIZES._100MiB,
    maxTotalBufferSize: SIZES._200MiB
};

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch(LAUNCH_OPTIONS);

    const page = await browser.newPage();
    await page._client.send('Network.enable', NETWORK_BUFFER_SIZE_FIX_PARAMS);
    await page.setDefaultNavigationTimeout(0);
    await page.goto(CU_RU_ENDPOINT, { waitUntil: 'networkidle0' });

    const categoriesArray = await page.evaluate(() => {
        const elements = document.querySelectorAll('li.header__navigation__item');
        const dataWithIds = [];
        elements.forEach(
            el => {
                const id = el.getAttribute('data-id');
                const href = el.querySelector('a').getAttribute('href');
                const name = href.match(/[^\/]+$/).pop();
                dataWithIds.push({ id, name, href });
            }
        );
        return dataWithIds;
    });

    await page.close();

    for (const category of categoriesArray) {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(
            `${CU_RU_ENDPOINT}${category.href}`,
            { waitUntil: 'networkidle0' }
        );
        const response = await page.waitForResponse(response => response.url().includes(`api/catalog/topmenu/${category.id}`));
        const data = await response.json();
        writeCategoryData(BASE_OUTPUT_PATH.CATEGORIES.RU, category.name, JSON.stringify(data), DEFAULT_CHARSET);
        await page.close();
    }

    await browser.close();
})();