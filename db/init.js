import mongoose from 'mongoose';

import { MONGODB_URL } from '../consts';
import { logger } from '../utils/logger';

(async () => {
    logger.debug(`Trying connect to DB ${MONGODB_URL} ...`);
    mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.once('open', _ => {
        logger.info('DB connected:', MONGODB_URL)
    });

    db.on('error', err => {
        logger.error(`Failed while trying connect to DB ${MONGODB_URL}\n ${err}`);
        logger.error(err);
    });
})();