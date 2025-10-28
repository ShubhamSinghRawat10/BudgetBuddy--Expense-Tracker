// Map of common currencies to symbols and localized formatting options
const CURRENCY_MAP = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
  INR: { symbol: '₹', locale: 'en-IN' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
};

export function getCurrencyMeta(code) {
  return CURRENCY_MAP[code] || CURRENCY_MAP.USD;
}

export function formatCurrency(amount, code = 'USD') {
  const { locale } = getCurrencyMeta(code);
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    const { symbol } = getCurrencyMeta(code);
    const value = Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
    return `${symbol}${value}`;
  }
}


