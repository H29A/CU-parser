import { DEFAULT_CHARSET, WAIT_FOR_RESPONSE_TIMEOUT, SLEEP_BEFORE_GETTING_CATEGORY_JSON_VALUE } from './consts';
import { writeCategoryData, initializePatchedPage, sleep } from './utils/utils';

export const parseCategoriesData = async (puppeteer, launchOptions, requestEndpoint, outputPath) => {
    const browser = await puppeteer.launch(launchOptions);
    const page = await initializePatchedPage(browser);

    await page.goto(requestEndpoint, { waitUntil: 'networkidle0' });

    const categoriesArray = await getCategoriesArray(page);
    await page.close();

    for (const category of categoriesArray) {
        await sleep(SLEEP_BEFORE_GETTING_CATEGORY_JSON_VALUE);
        const page = await initializePatchedPage(browser);
        await page.goto(
            `${requestEndpoint}${category.href}`,
            { waitUntil: 'networkidle0' }
        );
        const response = await page.waitForResponse(
            response => response.url().includes(`api/catalog/topmenu/${category.id}`),
            { timeout: WAIT_FOR_RESPONSE_TIMEOUT }
        );
        const jsonData = await response.json();
        writeCategoryData(outputPath, category.name, JSON.stringify(jsonData), DEFAULT_CHARSET);
        await page.close();
    }

    await browser.close();
};

const getCategoriesArray = async (page) => {
    return await page.evaluate(() => {
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
};
