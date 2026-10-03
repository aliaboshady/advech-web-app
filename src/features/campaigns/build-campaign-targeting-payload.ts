import { CampaignTargetingPayload, DeliveryMode } from "./types";

export type DaypartingKind = "" | "preset" | "custom";

export type TargetingFormValues = {
	timeZoneId: string;
	daypartingEdited: boolean;
	daypartingKind: DaypartingKind;
	schedulePresetCode: string;
	days: number[];
	startTime: string;
	endTime: string;
	daypartName: string;
	minAge: string;
	maxAge: string;
	interestsEdited: boolean;
	interestCodes: string[];
	venueTypesEdited: boolean;
	venueTypeCodes: string[];
	carsCount: string;
	deliveryMode: "" | DeliveryMode;
};

function wholeNumber(value: string): number | undefined {
	const trimmed = value.trim();
	if (!/^\d+$/.test(trimmed)) {
		return undefined;
	}
	return Number(trimmed);
}

function appendDayparting(
	payload: CampaignTargetingPayload,
	values: TargetingFormValues,
): void {
	if (!values.daypartingEdited) {
		return;
	}
	if (values.daypartingKind === "preset") {
		const code = values.schedulePresetCode.trim();
		if (code) {
			payload.schedulePresetCode = code;
		}
		return;
	}
	if (values.daypartingKind !== "custom") {
		return;
	}
	payload.dayparting = {
		days: [...values.days],
		startTime: values.startTime,
		endTime: values.endTime,
	};
	const name = values.daypartName.trim();
	if (name) {
		payload.daypartName = name;
	}
}

/**
 * Builds the targeting body. Dayparting is a Schedule Preset or a custom
 * window, never both. An unedited list is omitted; an edited empty list clears it.
 */
export function buildCampaignTargetingPayload(
	values: TargetingFormValues,
): CampaignTargetingPayload {
	const payload: CampaignTargetingPayload = {};
	const timeZoneId = values.timeZoneId.trim();
	const minAge = wholeNumber(values.minAge);
	const maxAge = wholeNumber(values.maxAge);
	const carsCount = wholeNumber(values.carsCount);
	if (timeZoneId) {
		payload.timeZoneId = timeZoneId;
	}
	appendDayparting(payload, values);
	if (minAge !== undefined) {
		payload.minAge = minAge;
	}
	if (maxAge !== undefined) {
		payload.maxAge = maxAge;
	}
	if (values.interestsEdited) {
		payload.interestCodes = [...values.interestCodes];
	}
	if (values.venueTypesEdited) {
		payload.venueTypeCodes = [...values.venueTypeCodes];
	}
	if (carsCount !== undefined) {
		payload.carsCount = carsCount;
	}
	if (values.deliveryMode) {
		payload.deliveryMode = values.deliveryMode;
	}
	return payload;
}

/**
 * A saved time zone wins. Otherwise the browser's zone, when it is still active.
 */
export function initialTimeZoneId(
	savedTimeZoneId: string | null | undefined,
	activeTimeZoneIds: readonly string[],
	browserTimeZoneId: string,
): string {
	if (savedTimeZoneId) {
		return savedTimeZoneId;
	}
	if (activeTimeZoneIds.includes(browserTimeZoneId)) {
		return browserTimeZoneId;
	}
	return "";
}
