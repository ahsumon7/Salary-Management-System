// src/utils/currency.ts

export const formatCurrency = (amount: number, currencySymbol: string = '৳'): string => {
    return `${currencySymbol}${amount.toFixed(2)}`;
};

export const parseCurrency = (currencyString: string): number => {
    const cleanedString = currencyString.replace(/[^\d.-]/g, '');
    return parseFloat(cleanedString);
};
