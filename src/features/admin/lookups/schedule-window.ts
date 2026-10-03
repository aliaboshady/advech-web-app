const MINUTES_PER_HOUR = 60;
const DAY_MIN = 1;
const DAY_MAX = 7;
const TIME_OF_DAY = /^([01]\d|2[0-3]):[0-5]\d$/;

export type ScheduleWindow = {
	readonly days: readonly number[];
	readonly startTime: string;
	readonly endTime: string;
};

export type ScheduleWindowIssue =
	| "no-days"
	| "day-out-of-range"
	| "invalid-time";

export type ScheduleWindowClock = {
	readonly startTime: string;
	readonly endTime: string;
};

/** True when `value` is a 24-hour `HH:mm` time. Surrounding spaces are ignored. */
export function isTimeOfDay(value: string): boolean {
	return TIME_OF_DAY.test(value.trim());
}

export type ScheduleWindowMessageKey =
	| "daysRequired"
	| "lookupDayOutOfRange"
	| "invalidTime";

/** The i18n key under `errors` for a refused Schedule Preset window. */
export function scheduleWindowMessageKey(
	issue: ScheduleWindowIssue,
): ScheduleWindowMessageKey {
	if (issue === "no-days") {
		return "daysRequired";
	}
	if (issue === "day-out-of-range") {
		return "lookupDayOutOfRange";
	}
	return "invalidTime";
}

export const SCHEDULE_WEEKDAYS = [
	{ day: 1, labelKey: "admin.lookups.days.monday" },
	{ day: 2, labelKey: "admin.lookups.days.tuesday" },
	{ day: 3, labelKey: "admin.lookups.days.wednesday" },
	{ day: 4, labelKey: "admin.lookups.days.thursday" },
	{ day: 5, labelKey: "admin.lookups.days.friday" },
	{ day: 6, labelKey: "admin.lookups.days.saturday" },
	{ day: 7, labelKey: "admin.lookups.days.sunday" },
] as const;

function minutesOfDay(time: string): number {
	const [hours, minutes] = time.split(":");
	return Number(hours) * MINUTES_PER_HOUR + Number(minutes);
}

/**
 * True when the window ends before it starts, so it runs past midnight.
 * Equal times stay on the same day. Times are `HH:mm`.
 */
export function windowCrossesMidnight(window: ScheduleWindowClock): boolean {
	return minutesOfDay(window.endTime) < minutesOfDay(window.startTime);
}

function daysAreValid(days: readonly number[]): boolean {
	const uniqueDays = new Set(days);
	return (
		uniqueDays.size === days.length &&
		days.length <= DAY_MAX &&
		days.every(
			(day) => Number.isInteger(day) && day >= DAY_MIN && day <= DAY_MAX,
		)
	);
}

/**
 * Why a Schedule Preset window cannot be sent.
 * Times are checked as `HH:mm` after trimming. Days are 1 to 7, Monday is 1.
 */
export function scheduleWindowIssue(
	window: ScheduleWindow,
): ScheduleWindowIssue | null {
	if (window.days.length === 0) {
		return "no-days";
	}
	if (!daysAreValid(window.days)) {
		return "day-out-of-range";
	}
	if (!isTimeOfDay(window.startTime) || !isTimeOfDay(window.endTime)) {
		return "invalid-time";
	}
	return null;
}
