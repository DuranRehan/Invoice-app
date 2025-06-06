import { Currency } from "../types";

export const defaultCurrencies: Currency[] = [
    {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        position: 'before',
        decimalPlaces: 2,
    },
    {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        position: 'after',
        decimalPlaces: 2,
    },
    {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound',
        position: 'before',
        decimalPlaces: 2,
    },
    {
        code: 'JPY',
        symbol: '¥',
        name: 'Japanese Yen',
        position: 'before',
        decimalPlaces: 0,
    },
];