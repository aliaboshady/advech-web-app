import { CampaignDetailsPayload, Money } from "./types";

export type CampaignDetailsFormValues = {
	name: string;
	objectiveCode: string;
	startDate: string;
	endDate: string;
	totalAmount: string;
	dailyAmount: string;
	currency: string;
};

const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** A calendar day at UTC midnight, written `YYYY-MM-DD`. */
export function formatCalendarDate(date: Date): string {
	const year = String(date.getUTCFullYear()).padStart(4, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/** True when `value` is a real `YYYY-MM-DD` day, not a rolled-forward date. */
export function isRealCalendarDate(value: string): boolean {
	if (!CALENDAR_DATE_PATTERN.test(value)) {
		return false;
	}
	return (
		new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value
	);
}

/** Parses a calendar day into the UTC midnight `Date` the date picker stores. */
export function parseCalendarDate(value: string): Date | undefined {
	if (!isRealCalendarDate(value)) {
		return undefined;
	}
	return new Date(`${value}T00:00:00.000Z`);
}

function buildMoneyPair(amount: string, currency: string): Money | undefined {
	const trimmedAmount = amount.trim();
	const trimmedCurrency = currency.trim();
	if (!trimmedAmount || !trimmedCurrency) {
		return undefined;
	}
	return { amount: trimmedAmount, currency: trimmedCurrency };
}

/**
 * Builds the details body. Empty fields are omitted, and a Budget is sent
 * only when its amount and currency are both present.
 */
export function buildCampaignDetailsPayload(
	values: CampaignDetailsFormValues,
): CampaignDetailsPayload {
	const payload: CampaignDetailsPayload = {};
	const name = values.name.trim();
	const objectiveCode = values.objectiveCode.trim();
	const totalBudget = buildMoneyPair(values.totalAmount, values.currency);
	const dailyBudget = buildMoneyPair(values.dailyAmount, values.currency);
	if (name) {
		payload.name = name;
	}
	if (objectiveCode) {
		payload.objectiveCode = objectiveCode;
	}
	if (values.startDate) {
		payload.startDate = values.startDate;
	}
	if (values.endDate) {
		payload.endDate = values.endDate;
	}
	if (totalBudget) {
		payload.totalBudget = totalBudget;
	}
	if (dailyBudget) {
		payload.dailyBudget = dailyBudget;
	}
	return payload;
}
