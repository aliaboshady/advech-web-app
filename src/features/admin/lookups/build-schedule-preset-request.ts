import {
	buildCreateLookupBody,
	buildUpdateLookupBody,
	CreateLookupBody,
	LookupFormValues,
	UpdateLookupBody,
} from "./build-lookup-request";
import { ScheduleWindow, scheduleWindowIssue } from "./schedule-window";

export type SchedulePresetFormValues = LookupFormValues & {
	readonly days: readonly number[];
	readonly startTime: string;
	readonly endTime: string;
};

export type CreateSchedulePresetBody = CreateLookupBody & ScheduleWindow;

export type UpdateSchedulePresetBody = UpdateLookupBody & ScheduleWindow;

function readyWindow(values: SchedulePresetFormValues): ScheduleWindow | null {
	const window = {
		days: [...values.days],
		startTime: values.startTime.trim(),
		endTime: values.endTime.trim(),
	};
	if (scheduleWindowIssue(window) !== null) {
		return null;
	}
	return window;
}

/**
 * Body for creating a Schedule Preset.
 * Returns null when the Lookup code or the window cannot be sent.
 */
export function buildCreateSchedulePresetBody(
	values: SchedulePresetFormValues,
): CreateSchedulePresetBody | null {
	const lookup = buildCreateLookupBody(values);
	const window = readyWindow(values);
	if (lookup === null || window === null) {
		return null;
	}
	return { ...lookup, ...window };
}

/**
 * Body for editing a Schedule Preset.
 * The code stays fixed. Returns null when the window cannot be sent.
 */
export function buildUpdateSchedulePresetBody(
	values: SchedulePresetFormValues,
): UpdateSchedulePresetBody | null {
	const window = readyWindow(values);
	if (window === null) {
		return null;
	}
	return { ...buildUpdateLookupBody(values), ...window };
}
