import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import _ from 'lodash';
import { Telegraf } from 'telegraf';
import moment from 'moment';

import { writeProductsData, readProductsData, getChronicleProductsFolder } from './utils/utils';
import {
    LAUNCH_OPTIONS,
    BASE_OUTPUT_PATH,
    DEFAULT_URL,
    DEFAULT_FILENAME,
    DEFAULT_CHARSET,
    DEFAULT_REFRESH_DATA_INTERVAL,
    DEFAULT_PARSE_INTERVAL,
    MAX_INT_VALUE,
    DEFAULT_DATE_FORMAT,
    CU_ENDPOINT,
    SIZES
} from './consts';

import CU_MAP from './maps/cu-map';

puppeteer.use(StealthPlugin());  // Add stealth plugin and use defaults (all evasion techniques)

const MAP = _.find(CU_MAP.lang, { label: 'ru' });
const BASE_PATH = MAP.paths.catalogues.categories.hardware.childPaths;

const filteredDataFromProductsArray = (data) => {
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
};

const syncProductData = async (browser, options = {}) => {
    const {
        url = DEFAULT_URL,
        folder = BASE_OUTPUT_PATH.PRODUCTS.RU,
        filename = DEFAULT_FILENAME,
        charset = DEFAULT_CHARSET
    } = options;

    const page = await browser.newPage();

    await page._client.send('Network.enable', {
        maxResourceBufferSize: SIZES._100MiB,
        maxTotalBufferSize: SIZES._200MiB
    })

    await page.setDefaultNavigationTimeout(0);

    const SUBSTITUTION_HITS_VALUE = MAX_INT_VALUE.toString();

    await page.goto(url, { waitUntil: 'networkidle0' });
    const $hitsSelector = await page.$('select.ais-HitsPerPage-select');
    await $hitsSelector.$eval(
        'option.ais-HitsPerPage-option[value="60"]',
        (el, value) => el.value = value
    , SUBSTITUTION_HITS_VALUE);
    await $hitsSelector.select(SUBSTITUTION_HITS_VALUE);

    const response = await page.waitForResponse(response => response.url().includes('search'));
    const data = await response.json();
    const filteredData = filteredDataFromProductsArray(data.results[0].hits);
    const preparedData = JSON.stringify(filteredData);
    writeProductsData(folder, filename, preparedData, charset);

    await page.close();
};

(async () => {
    const browser = await puppeteer.launch(LAUNCH_OPTIONS);

    BASE_PATH.forEach((child, index) => {
        setTimeout(function () {
            setInterval(async () => {
                await syncProductData(browser, {
                    url: child.fullPath,
                    folder: getChronicleProductsFolder(child.filename),
                    filename: child.filename,
                });
            }, DEFAULT_REFRESH_DATA_INTERVAL);
        }, index * DEFAULT_PARSE_INTERVAL);
    });

    /*
    const chronicleFilename = getChronicleFilename(FILENAMES.GRAPHIC_CARDS, moment().format(DEFAULT_DATE_FORMAT));
    const data = readProductsData(DEFAULT_OUTPUT_PATH, chronicleFilename, DEFAULT_CHARSET);

    const test = _.sample(data);

    const bot = new Telegraf(process.env.BOT_TOKEN);
    bot.command('/get', ctx => ctx.reply(
        `Name: ${test.name}\n` +
        `SKU: ${test.sku}\n` +
        `Price: ${test.price_ag}\n` +
        `In stoke now: ${test.canPickupInStore}\n` +
        `Available to buy now: ${test.relevant_availability}\n` +
        `${CU_ENDPOINT}/${test.url}\n`
    ));
    bot.start(ctx => ctx.reply(
        JSON.stringify(
            _.sample(data)
        )
    ));
    await bot.launch();
    */

    //await browser.close();
})();