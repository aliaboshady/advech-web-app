import { Money } from "./types";

/** Formats a Money for display; falls back to "amount currency" for an unknown currency code. */
export function formatMoney(money: Money | null | undefined, locale: string) {
	if (!money) return "—";
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: money.currency,
		}).format(Number(money.amount));
	} catch {
		return `${money.amount} ${money.currency}`;
	}
}
