import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path, { resolve } from 'path';
import moment from 'moment';

import { DEFAULT_CHARSET, SIZES } from '../consts';
import { logger } from './logger';

const writeFileSyncRecursive = (folder, filename, content, charset) => {
    logger.debug(`Trying to write ${filename} (${charset})`);
    const folders = folder.split(path.sep).slice(0, -1);

    try {
        if (folders.length) {
            logger.debug(`Checking existing ${folder}`);
            folders.reduce((last, folder) => {
                const folderPath = last ? last + path.sep + folder : folder
                if (!existsSync(folderPath)) {
                    logger.debug(`Folder ${folderPath} doesn't exist, creating`);
                    mkdirSync(folderPath)
                    logger.debug(`Success! ${folderPath} has been created!`);
                } else {
                    logger.debug(`Path ${folderPath} exists, creation is not required`);
                }
                return folderPath;
            })
        }
        writeFileSync(folder, content, charset);
        logger.info(`${filename} was successfully written!`);
    } catch (err) {
        logger.error(err.message);
        throw Error(err);
    }
};

const writeAnyData = (path, filename, data, charset = DEFAULT_CHARSET) =>  {
    const resultPath = resolve(path, filename);
    writeFileSyncRecursive(resultPath, filename, data, charset);
};

const readAnyData = (path, filename, charset = DEFAULT_CHARSET) => {
    logger.debug(`Trying to read ${path} (${charset})`);

    try{
        const readyData = readFileSync(path, charset);
        logger.info(`${path} data was ready!`);
        return JSON.parse(readyData);
    } catch(err) {
        logger.error(err);
        throw Error(err);
    }
};

export const getDateMark = () => moment().format('DD.MM.YYYY');
export const getCleanedName = filename => filename.replace(/(\.\w+)$/, '');
const markProductsFilename = filename => {
    const filenameWithoutExtension = getCleanedName(filename);
    return `${filenameWithoutExtension}-${getDateMark()}.json`;
}
export const readProductsData = (path, filename, charset) => readAnyData(path, filename, charset);
export const writeProductsData = (path, filename, data, charset) => {
    const markedFileName = markProductsFilename(filename);
    writeAnyData(path, markedFileName, data, charset);
};

const markCategoryFilename = filename => `${getCleanedName(filename)}.json`;
export const writeCategoryData = (path, filename, data, charset) => writeAnyData(path, markCategoryFilename(filename), data, charset);
export const readCategoriesData = (path, filename, charset) => readAnyData(path, filename, charset);
export const getAllCategoryFilenames = path => readdirSync(path);

export const initializePatchedPage = async browser => {
    const page = await browser.newPage();
    await page._client.send('Network.enable', {
        maxResourceBufferSize: SIZES._100MiB,
        maxTotalBufferSize: SIZES._200MiB
    });
    await page.setDefaultNavigationTimeout(0);
    return page;
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}