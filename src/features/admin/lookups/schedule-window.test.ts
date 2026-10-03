import { describe, expect, it } from "vitest";
import { windowCrossesMidnight } from "./schedule-window";

describe("windowCrossesMidnight", () => {
	it("is true when the end time is before the start time", () => {
		expect(
			windowCrossesMidnight({ startTime: "18:00", endTime: "02:00" }),
		).toBe(true);
	});

	it("is false when the end time is after the start time", () => {
		expect(
			windowCrossesMidnight({ startTime: "07:00", endTime: "10:00" }),
		).toBe(false);
	});

	it("is false when the start and end times are equal", () => {
		expect(
			windowCrossesMidnight({ startTime: "07:00", endTime: "07:00" }),
		).toBe(false);
	});
});
