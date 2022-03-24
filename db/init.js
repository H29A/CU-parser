import mongoose from 'mongoose';
import { resolve } from 'path';
import _ from 'lodash';

import { BASE_OUTPUT_PATH, MONGODB_URL } from '../consts';
import { logger } from '../utils/logger';
import { getAllCategoryFilenames, readCategoriesData } from '../utils/utils';

import { Category } from './models/category';

const recursiveProcessCategories = async categoriesArray => {
    categoriesArray.forEach(category => {
        logger.info(`Parsing ${category.Name} category started`);
        const DBObject = new Category(category);
        if (!_.isEmpty(DBObject)) {
            DBObject.save((err, obj) => {
                if (err) {
                    return logger.error(`Failed while saving ${category.Name}`);
                }
                logger.info(`Category ${category.Name} successfully saved to the DB`);
            });
            if (!_.isEmpty(category.Categories)) {
                logger.debug(`Category ${category.Name} have ${category.Categories.length} subcategories`);
                recursiveProcessCategories(category.Categories);
            }
        }
    });
};

(async () => {
    logger.debug(`Trying connect to DB ${MONGODB_URL}`);
    mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.once('open', async _ => {
        logger.info(`DB connected:`);
        const categoryFilenamesArray = getAllCategoryFilenames(BASE_OUTPUT_PATH.CATEGORIES.RU) || [];
        categoryFilenamesArray.length && categoryFilenamesArray.forEach(categoryFileName => {
            const path = resolve(BASE_OUTPUT_PATH.CATEGORIES.RU, categoryFileName);
            const categoriesFileData = readCategoriesData(path);
            recursiveProcessCategories(categoriesFileData);
        });
    });

    db.on('error', err => {
        logger.error(`Failed while trying connect to DB ${MONGODB_URL}\n ${err}`);
        logger.error(err);
    });
})();