import { resolve } from 'path';

export const CU_ENDPOINT = 'https://www.computeruniverse.net';
export const CU_RU_ENDPOINT = `${CU_ENDPOINT}/ru`;

export const DEFAULT_CHARSET = 'utf8';

const BASE_CU_CHRONICLE_PATH = './chronicle/CU';
const CU_PRODUCTS_PATH = 'products';
const CU_CATEGORIES_PATH = 'categories';
const CU_RU_PATH = 'russian';

export const BASE_OUTPUT_PATH = {
    PRODUCTS: {
        RU: resolve(BASE_CU_CHRONICLE_PATH, CU_PRODUCTS_PATH, CU_RU_PATH)
    },
    CATEGORIES: {
        RU: resolve(BASE_CU_CHRONICLE_PATH, CU_CATEGORIES_PATH, CU_RU_PATH)
    }
};

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';
export const DEFAULT_TIME_FORMAT = 'HH:mm:ss'

export const HITS_REQUEST_LIMIT = 1000;
export const MAX_INT_VALUE = 2147483647;

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const DEVELOPMENT_LAUNCH_OPTIONS = {
    headless: false,         // Enable UI mode
    defaultViewport: {
        width : 0, height: 0 // Makes chromium set the viewport by inferring the current screen resolution
    },
    args: ['--start-maximized']
};

export const PRODUCTION_LAUNCH_OPTIONS = {

};

export const LAUNCH_OPTIONS = IS_DEVELOPMENT ? DEVELOPMENT_LAUNCH_OPTIONS : PRODUCTION_LAUNCH_OPTIONS;

export const DEFAULT_LOG_OUTPUT_PATH = './log';

export const SIZES = {
    _100MiB: 1024 * 1024 * 100,
    _200MiB: 1024 * 1024 * 200
}

export const REGEX = {
    LAST_AFTER_SLASH: /[^\/]+$/
}

export const SLEEP_BEFORE_GETTING_CATEGORY_JSON_VALUE = 15000;
export const WAIT_FOR_RESPONSE_TIMEOUT = 300000;

export const MONGODB_URL = 'mongodb://127.0.0.1:27017/CU-DB';