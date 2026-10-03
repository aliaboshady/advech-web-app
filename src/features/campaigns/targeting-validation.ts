import * as Yup from "yup";
import type { DaypartingKind } from "./build-campaign-targeting-payload";
import { hasZoneRoleContradiction } from "./zone-role";

const AGE_MIN = 13;
const AGE_MAX = 99;
const VENUE_TYPE_MAX = 50;
const ZONE_ID_MAX = 100;
const CARS_COUNT_MIN = 1;
const DAY_MIN = 1;
const DAY_MAX = 7;
const TIME_OF_DAY_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

type DaypartingParent = {
	daypartingEdited?: boolean;
	daypartingKind?: DaypartingKind;
};

function isBlank(value: string | undefined): boolean {
	return !value?.trim();
}

function isWholeNumber(value: string): boolean {
	return /^\d+$/.test(value);
}

function isAge(value: string): boolean {
	if (!isWholeNumber(value)) {
		return false;
	}
	const age = Number(value);
	return age >= AGE_MIN && age <= AGE_MAX;
}

function isOptionalAge(value: string | undefined): boolean {
	return isBlank(value) || isAge(value?.trim() ?? "");
}

/** A time-of-day field that only matters while a custom window is being sent. */
function customWindowTime(name: string) {
	return Yup.string().test(name, "invalidTime", function validateTime(value) {
		if (!isCustomDayparting(this.parent as DaypartingParent)) {
			return true;
		}
		return TIME_OF_DAY_PATTERN.test(value ?? "");
	});
}

function isCustomDayparting(parent: DaypartingParent): boolean {
	return Boolean(parent.daypartingEdited) && parent.daypartingKind === "custom";
}

/** Client-side limits for the Targeting step, matching the targeting contract. */
export const targetingValidationSchema = Yup.object({
	schedulePresetCode: Yup.string().test(
		"schedulePresetCode",
		"schedulePresetRequired",
		function validatePreset(value) {
			const parent = this.parent as DaypartingParent;
			if (!parent.daypartingEdited || parent.daypartingKind !== "preset") {
				return true;
			}
			return !isBlank(value);
		},
	),
	days: Yup.array()
		.of(Yup.number())
		.test("days", "daysRequired", function validateDays(days) {
			if (!isCustomDayparting(this.parent as DaypartingParent)) {
				return true;
			}
			const list = (days ?? []).filter(
				(day): day is number => day !== undefined,
			);
			const uniqueDays = new Set(list);
			return (
				list.length > 0 &&
				list.length <= DAY_MAX &&
				uniqueDays.size === list.length &&
				list.every(
					(day) => Number.isInteger(day) && day >= DAY_MIN && day <= DAY_MAX,
				)
			);
		}),
	startTime: customWindowTime("startTime"),
	endTime: customWindowTime("endTime"),
	daypartName: Yup.string()
		.test("daypartName", function validateDaypartName(value) {
			const parent = this.parent as DaypartingParent;
			const name = value?.trim() ?? "";
			if (!parent.daypartingEdited || !name) {
				return true;
			}
			if (parent.daypartingKind === "preset") {
				return this.createError({ message: "daypartNameNotAllowed" });
			}
			if (parent.daypartingKind !== "custom") {
				return this.createError({ message: "daypartNameWithoutWindow" });
			}
			return true;
		}),
	minAge: Yup.string().test("minAge", "ageOutOfRange", isOptionalAge),
	maxAge: Yup.string()
		.test("maxAge", "ageOutOfRange", isOptionalAge)
		.test("ageOrder", "ageRangeInvalid", function validateAgeOrder(maxAge) {
			const minAge = this.parent.minAge as string | undefined;
			if (isBlank(minAge) || isBlank(maxAge)) {
				return true;
			}
			if (!isAge(minAge?.trim() ?? "") || !isAge(maxAge?.trim() ?? "")) {
				return true;
			}
			return Number(maxAge) >= Number(minAge);
		}),
	venueTypeCodes: Yup.array().max(VENUE_TYPE_MAX, "tooManyVenueTypes"),
	inclusionZoneIds: Yup.array()
		.of(Yup.string().required())
		.max(ZONE_ID_MAX, "tooManyZones"),
	exclusionZoneIds: Yup.array()
		.of(Yup.string().required())
		.max(ZONE_ID_MAX, "tooManyZones")
		.test(
			"exclusionZoneIds",
			"zoneRoleContradiction",
			function validateZoneRoles(exclusionZoneIds) {
				const inclusionZoneIds = (this.parent.inclusionZoneIds ??
					[]) as string[];
				const exclusion = (exclusionZoneIds ?? []).filter(
					(zoneId): zoneId is string => Boolean(zoneId),
				);
				return !hasZoneRoleContradiction(inclusionZoneIds, exclusion);
			},
		),
	carsCount: Yup.string().test("carsCount", "carsCountMin", (value) => {
		if (isBlank(value)) {
			return true;
		}
		const trimmed = value?.trim() ?? "";
		return isWholeNumber(trimmed) && Number(trimmed) >= CARS_COUNT_MIN;
	}),
	deliveryMode: Yup.string().oneOf(["", "MOVING", "FIXED"]),
});
