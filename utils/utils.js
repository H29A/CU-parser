import fs from 'fs';
import path, { resolve } from 'path';
import moment from 'moment';

import { BASE_OUTPUT_PATH } from '../consts';
import { logger } from './logger';

const writeFileSyncRecursive = (folder, filename, content, charset) => {
    logger.debug(`Trying to write ${filename} (${charset})...`);
    const folders = folder.split(path.sep).slice(0, -1);

    try {
        if (folders.length) {
            logger.debug(`Checking existing ${folder}...`);
            folders.reduce((last, folder) => {
                const folderPath = last ? last + path.sep + folder : folder
                if (!fs.existsSync(folderPath)) {
                    logger.debug(`Folder ${folderPath} doesn't exist, creating`);
                    fs.mkdirSync(folderPath)
                    logger.debug(`Success! ${folderPath} has been created!`);
                } else {
                    logger.debug(`Path ${folderPath} exists, creation is not required`);
                }
                return folderPath;
            })
        }
        fs.writeFileSync(folder, content, charset);
        logger.info(`${filename} was successfully written!`);
    } catch (err) {
        logger.error(err.message);
        throw Error(err);
    }
};

const writeAnyData = (path, filename, data, charset) =>  {
    const resultPath = resolve(path, filename);
    writeFileSyncRecursive(resultPath, filename, data, charset);
}

export const writeProductsData = (path, filename, data, charset) => {
    const markedFilename = `${filename}-${moment().format('DD.MM.YYYY')}.json`;
    writeAnyData(path, markedFilename, data, charset);
};

export const writeCategoryData = (path, filename, data, charset) => writeAnyData(path, `${filename}.json`, data, charset);

export const readProductsData = (path, charset) => {
    logger.debug(`Trying to read ${path} (${charset})...`);

    try{
        const readyData = fs.readFileSync(path, charset);
        logger.info(`${path} data was ready!`);
        return JSON.parse(readyData);
    } catch(err) {
        logger.error(err);
        throw Error(err);
    }
}

export const getChronicleProductsFolder = (filename) => {
    return resolve(BASE_OUTPUT_PATH.PRODUCTS.RU, filename);
};

export const getChronicleCategoriesFolder = (filename) => {
    return resolve(BASE_OUTPUT_PATH.CATEGORIES.RU, filename);
};