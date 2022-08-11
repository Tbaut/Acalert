import { resolve } from 'path';
import { bgCyan, black } from 'kolorist';
export const port = parseInt(process.env.PORT || '') || 3303;
export const r = (...args) => resolve(__dirname, '..', ...args);
export const isDev = process.env.NODE_ENV !== 'production';
export function log(name, message) {
    // eslint-disable-next-line no-console
    console.log(black(bgCyan(` ${name} `)), message);
}
