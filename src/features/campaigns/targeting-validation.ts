import * as Yup from "yup";

const AGE_MIN = 13;
const AGE_MAX = 99;
const DAYPART_NAME_MAX_LENGTH = 100;
const LOOKUP_LIST_MAX = 50;
const CARS_COUNT_MIN = 1;
const DAY_MIN = 1;
const DAY_MAX = 7;
const TIME_OF_DAY_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

type DaypartingParent = {
	daypartingEdited?: boolean;
	daypartingKind?: string;
};

function isBlank(value: string | undefined): boolean {
	return !value?.trim();
}

function isAge(value: string): boolean {
	if (!/^\d+$/.test(value)) {
		return false;
	}
	const age = Number(value);
	return age >= AGE_MIN && age <= AGE_MAX;
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
	startTime: Yup.string().test(
		"startTime",
		"invalidTime",
		function validateStartTime(value) {
			if (!isCustomDayparting(this.parent as DaypartingParent)) {
				return true;
			}
			return TIME_OF_DAY_PATTERN.test(value ?? "");
		},
	),
	endTime: Yup.string().test(
		"endTime",
		"invalidTime",
		function validateEndTime(value) {
			if (!isCustomDayparting(this.parent as DaypartingParent)) {
				return true;
			}
			return TIME_OF_DAY_PATTERN.test(value ?? "");
		},
	),
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
			if (name.length > DAYPART_NAME_MAX_LENGTH) {
				return this.createError({ message: "daypartNameMax" });
			}
			return true;
		}),
	minAge: Yup.string().test(
		"minAge",
		"ageOutOfRange",
		(value) => isBlank(value) || isAge(value?.trim() ?? ""),
	),
	maxAge: Yup.string()
		.test(
			"maxAge",
			"ageOutOfRange",
			(value) => isBlank(value) || isAge(value?.trim() ?? ""),
		)
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
	interestCodes: Yup.array().max(LOOKUP_LIST_MAX, "tooManyInterests"),
	venueTypeCodes: Yup.array().max(LOOKUP_LIST_MAX, "tooManyVenueTypes"),
	carsCount: Yup.string().test("carsCount", "carsCountMin", (value) => {
		if (isBlank(value)) {
			return true;
		}
		const trimmed = value?.trim() ?? "";
		return /^\d+$/.test(trimmed) && Number(trimmed) >= CARS_COUNT_MIN;
	}),
	deliveryMode: Yup.string().oneOf(["", "MOVING", "FIXED"]),
});
