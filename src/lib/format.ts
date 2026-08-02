/**
 * All prices in the app (product data, cart, orders, settings) are stored
 * natively in INR — this is an India-based store and INR is the only
 * currency customers can currently select.
 *
 * The multi-currency plumbing below is kept intact on purpose: RATES and
 * SYMBOLS already cover USD/EUR/GBP, converted relative to INR as the base.
 * To open the store up to another currency later, just add it to
 * ACTIVE_CURRENCIES — every price display already runs through
 * formatPrice() and will pick it up with no other code changes. Rates are
 * a rough, periodically-updated snapshot (not live), same as most storefronts
 * that don't wire up a live FX feed.
 */
export type Currency = "INR" | "USD" | "EUR" | "GBP";

/** Currencies actually offered to shoppers today. Add to this list to expand. */
export const ACTIVE_CURRENCIES: Currency[] = ["INR"];

export const DEFAULT_CURRENCY: Currency = "INR";

const RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.0104,
  EUR: 0.00965,
  GBP: 0.0082,
};

const SYMBOLS: Record<Currency, string> = {
  INR: "\u20b9",
  USD: "$",
  EUR: "\u20ac",
  GBP: "\u00a3",
};

/** Display label for currency pickers, e.g. "INR ₹" — kept alongside SYMBOLS so any future picker UI needs zero hardcoded copies. */
export const CURRENCY_LABELS: Record<Currency, string> = {
  INR: `INR ${SYMBOLS.INR}`,
  USD: `USD ${SYMBOLS.USD}`,
  EUR: `EUR ${SYMBOLS.EUR}`,
  GBP: `GBP ${SYMBOLS.GBP}`,
};

const LOCALES: Record<Currency, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "en-US",
  GBP: "en-GB",
};

export function formatPrice(amountInr: number | undefined | null, currency: Currency = DEFAULT_CURRENCY): string {
  if (amountInr == null || Number.isNaN(amountInr)) return "\u2014";
  const converted = Math.round(amountInr * RATES[currency]);
  return `${SYMBOLS[currency]}${converted.toLocaleString(LOCALES[currency])}`;
}
