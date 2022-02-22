import { createLogger, transports, format } from 'winston';
import { resolve } from 'path';

import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, IS_DEVELOPMENT, DEFAULT_LOG_OUTPUT_PATH } from '../consts';

const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const alignLoggerTime = format.combine(
    format.timestamp({ format: `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}` }),
    format.printf(
        info => `[${info.level} ${info.timestamp}] ${info.message}`
    )
);

const CURRENT_LOG_LEVEL = IS_DEVELOPMENT ? 'debug' : 'info';
const ERROR_LOG_OUTPUT_PATH = resolve(DEFAULT_LOG_OUTPUT_PATH, 'error.log');
const COMMON_LOG_OUTPUT_PATH = resolve(DEFAULT_LOG_OUTPUT_PATH, 'common.log');

export const logger = createLogger({
    levels: LOG_LEVELS,
    level: CURRENT_LOG_LEVEL,
    transports: [
        new (transports.Console)({
            format: format.combine(format.colorize({ all: true }), alignLoggerTime)
        }),
        new transports.File({
            filename: ERROR_LOG_OUTPUT_PATH, level: 'error',
            format: alignLoggerTime
        }),
        new transports.File({
            filename: COMMON_LOG_OUTPUT_PATH,
            format: alignLoggerTime
        })
    ],
});