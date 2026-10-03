import { describe, expect, it } from "vitest";
import {
	buildCreateSchedulePresetBody,
	buildUpdateSchedulePresetBody,
} from "./build-schedule-preset-request";

const values = {
	code: "  late-night  ",
	name: "  Late night  ",
	description: "  After midnight  ",
	sortOrder: "1",
	days: [6, 7],
	startTime: "18:00",
	endTime: "02:00",
};

describe("buildCreateSchedulePresetBody", () => {
	it("sends the lookup fields and the window", () => {
		expect(buildCreateSchedulePresetBody(values)).toEqual({
			code: "late-night",
			name: "Late night",
			description: "After midnight",
			sortOrder: 1,
			days: [6, 7],
			startTime: "18:00",
			endTime: "02:00",
		});
	});

	it("does not send a preset when no days are chosen", () => {
		expect(buildCreateSchedulePresetBody({ ...values, days: [] })).toBeNull();
	});

	it("does not send a day outside 1 to 7", () => {
		expect(buildCreateSchedulePresetBody({ ...values, days: [0] })).toBeNull();
		expect(buildCreateSchedulePresetBody({ ...values, days: [8] })).toBeNull();
	});

	it("does not send a preset when the code cannot be stored", () => {
		expect(
			buildCreateSchedulePresetBody({ ...values, code: "Late" }),
		).toBeNull();
	});

	it("does not send a time that is not HH:mm", () => {
		expect(
			buildCreateSchedulePresetBody({ ...values, startTime: "7:00" }),
		).toBeNull();
		expect(
			buildCreateSchedulePresetBody({ ...values, endTime: "25:00" }),
		).toBeNull();
		expect(
			buildCreateSchedulePresetBody({ ...values, startTime: "18:00:00" }),
		).toBeNull();
	});
});

describe("buildUpdateSchedulePresetBody", () => {
	it("sends the name and the window, and never the code", () => {
		const body = buildUpdateSchedulePresetBody(values);
		expect(body).toEqual({
			name: "Late night",
			description: "After midnight",
			sortOrder: 1,
			days: [6, 7],
			startTime: "18:00",
			endTime: "02:00",
		});
		expect(body).not.toHaveProperty("code");
	});

	it("does not send an edit when the window is invalid", () => {
		expect(buildUpdateSchedulePresetBody({ ...values, days: [] })).toBeNull();
		expect(buildUpdateSchedulePresetBody({ ...values, days: [8] })).toBeNull();
		expect(
			buildUpdateSchedulePresetBody({ ...values, endTime: "abc" }),
		).toBeNull();
	});
});
