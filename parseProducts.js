import puppeteer from 'puppeteer-extra';
import _ from 'lodash';

import { initializePatchedPage, sleep, writeProductsData } from './utils/utils';
import { CU_RU_ENDPOINT, HITS_REQUEST_LIMIT, LAUNCH_OPTIONS, MAX_INT_VALUE, REGEX,
    SLEEP_BEFORE_GETTING_CATEGORY_JSON_VALUE, WAIT_FOR_RESPONSE_TIMEOUT } from './consts';
import { logger } from './utils/logger';


export const parseProductsData = async (parent, path, filename) => {
    const URL = `${CU_RU_ENDPOINT}/${parent.SeName}`;
    await sleep(SLEEP_BEFORE_GETTING_CATEGORY_JSON_VALUE);
    const productsData =  await getCategoryJSON(puppeteer, LAUNCH_OPTIONS, URL);

    if (_.isEmpty(productsData)) {
        return;
    }

    const { nbHits, hits } = productsData;
    if (productsData.nbHits >= HITS_REQUEST_LIMIT && parent.Categories.length) {
        logger.debug(`Products in category ${nbHits} what >= ${HITS_REQUEST_LIMIT}, start parsing child subcategory`);
        for (const subcategory of parent.Categories) {
            const subfilename = subcategory.SeName.match(REGEX.LAST_AFTER_SLASH).pop();
            await parseProductsData(subcategory, path, subfilename);
        }
        return;
    }
    logger.debug(`${URL} successfully parsed. trying to write data`);
    writeProductsData(path, filename, JSON.stringify(hits));
};

const getCategoryJSON = async (puppeteer, launchOptions, categoryURL) => {
    logger.debug(`Trying to parse ${categoryURL}`);

    const browser = await puppeteer.launch(launchOptions);
    const page = await initializePatchedPage(browser);

    await page.goto(categoryURL, { waitUntil: 'networkidle0' });

    try {
        await spoofHitsCount(page);
    } catch(err) {
        logger.error(err.message);
        return [];
    }

    try {
        const response = await page.waitForResponse(
            response => response.url().includes('search'),
            { timeout: WAIT_FOR_RESPONSE_TIMEOUT }
        );

        const jsonData = await response.json();

        await page.close();
        await browser.close();

        const cleanedData = _.first(jsonData.results);
        logger.info(`Products json from ${categoryURL} successfully loaded`);
        return cleanedData;

    } catch (err) {
        logger.error(err.message);
        logger.info(`Failed while trying get ${categoryURL} JSON, repeating...`);
        await parseProductsData(puppeteer, launchOptions, categoryURL);
    }
};

const spoofHitsCount = async page => {
    const SUBSTITUTION_HITS_COUNT = MAX_INT_VALUE.toString();

    const $hitsSelector = await page.$('select.ais-HitsPerPage-select');
    await $hitsSelector.$eval(
        'option.ais-HitsPerPage-option[value="60"]',
        (el, value) => el.value = value,
        SUBSTITUTION_HITS_COUNT
    );
    await $hitsSelector.select(SUBSTITUTION_HITS_COUNT);
    logger.debug(`Hits successfully spoofed to ${SUBSTITUTION_HITS_COUNT}`);
};

/*const filteredDataFromProductsArray = (data) => {
    return data.reduce((acc, item) => {
        acc.push({
            productid: item.productid,
            sku: item.sku,
            name: item.name,
            manufacturer: item.manufacturer,
            deliverydatenow: item.deliverydatenow,
            url: item.url,
            image_url: item.image_url,
            image_url_set: item.image_url_set,
            canPickupInStore: item.canPickupInStore,
            relevant_availability: item.relevant_availability,
            dateexpected: item.dateexpected,
            publish_time: item.publish_time,
            price_ag: item.price_ag
        });
        return acc;
    }, []);
};*/
