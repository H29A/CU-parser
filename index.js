import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { resolve } from 'path';

import { parseCategoriesData } from './parseCategories';
import { parseProductsData } from './parseProducts';

import { LAUNCH_OPTIONS, CU_RU_ENDPOINT, BASE_OUTPUT_PATH, REGEX } from './consts';
import { getAllCategoryFilenames, readCategoriesData, getCleanedName, getDateMark } from './utils/utils';
import { logger } from './utils/logger';

puppeteer.use(StealthPlugin());  // Add stealth plugin and use defaults (all evasion techniques)

(async () => {
    await parseCategoriesData(puppeteer, LAUNCH_OPTIONS, CU_RU_ENDPOINT, BASE_OUTPUT_PATH.CATEGORIES.RU);
    const categoryFilenamesArray = getAllCategoryFilenames(BASE_OUTPUT_PATH.CATEGORIES.RU) || [];
    await iterateCategoryFiles(categoryFilenamesArray);
})();

const iterateCategoryFiles = async (categoryFilenamesArray) => {
    logger.info(`Loaded ${categoryFilenamesArray.length} category files`);
    for (const filename of categoryFilenamesArray) {
        logger.info(`Parsing file "${filename}" is being processed`);
        const path = resolve(BASE_OUTPUT_PATH.CATEGORIES.RU, filename);
        const category = readCategoriesData(path);
        for (const subcategory of category) {
            logger.debug(`Found "${subcategory.Name}", started recursive processing`);
            const categoryOutputPath = getCleanedName(
                resolve(BASE_OUTPUT_PATH.PRODUCTS.RU, getDateMark(), filename)
            );
            const subfilename = subcategory.SeName.match(REGEX.LAST_AFTER_SLASH).pop();
            await parseProductsData(subcategory, categoryOutputPath, subfilename);
        }
    }
};