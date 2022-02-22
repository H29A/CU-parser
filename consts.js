import { resolve } from 'path';

export const CU_ENDPOINT = 'https://www.computeruniverse.net';
export const CU_IMG_ENDPOINT = 'https://img.computerunivers.net';

export const DEFAULT_URL = `${CU_ENDPOINT}/ru/c/apparatnoe-obespechenie-i-komponenty/komplektuyushhie-dlya-pk`;
export const DEFAULT_FILENAME = 'UNTILED';
export const BASE_OUTPUT_PATH = resolve('./chronicle/CU');
export const DEFAULT_CHARSET = 'utf8';

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';
export const DEFAULT_TIME_FORMAT = 'HH.mm.ss'

export const DEFAULT_REFRESH_DATA_INTERVAL = 60000;
export const DEFAULT_PARSE_INTERVAL = 133333;

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

export const DEFAULT_LOG_OUTPUT_PATH = './log';