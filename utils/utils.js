import fs from 'fs';
import path, { resolve } from 'path';
import moment from 'moment';

import { BASE_OUTPUT_PATH } from '../consts';
import { logger } from './logger';

const writeFileSyncRecursive = (filename, content, charset) => {
    logger.debug(`Trying to write ${filename} (${charset})...`);
    const folders = filename.split(path.sep).slice(0, -1);

    try {
        if (folders.length) {
            logger.debug(`Checking existing ${filename}...`);
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
        fs.writeFileSync(filename, content, charset);
        logger.info(`${filename} was successfully written!`);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};


export const writeProductsData = (path, filename, data, charset) => {
    const markedName = filename => `${filename}-${moment().format('DD.MM.YYYY')}`
    const pathToFile = resolve(path, markedName(filename));
    writeFileSyncRecursive(pathToFile, data, charset);
};

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

export const getChronicleFolder = (filename) => {
    return resolve(BASE_OUTPUT_PATH, filename);
};