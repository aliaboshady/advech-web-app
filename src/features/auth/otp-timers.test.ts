import { describe, expect, it } from "vitest";
import { deadlinesFrom, formatCountdown, secondsUntil } from "./otp-timers";

describe("deadlinesFrom", () => {
	it("turns the response's seconds into absolute times", () => {
		expect(
			deadlinesFrom(1_000_000, {
				expiresInSeconds: 180,
				resendAvailableInSeconds: 60,
			}),
		).toEqual({ expiresAt: 1_180_000, resendAvailableAt: 1_060_000 });
	});

	it("treats a missing or negative number as already due", () => {
		expect(
			deadlinesFrom(5_000, {
				expiresInSeconds: -3,
				resendAvailableInSeconds: Number.NaN,
			}),
		).toEqual({ expiresAt: 5_000, resendAvailableAt: 5_000 });
	});
});

describe("secondsUntil", () => {
	it("counts down from absolute times, so a refresh does not restart it", () => {
		const { resendAvailableAt } = deadlinesFrom(0, {
			expiresInSeconds: 180,
			resendAvailableInSeconds: 60,
		});
		expect(secondsUntil(resendAvailableAt, 0)).toBe(60);
		// the page is refreshed 25 seconds later
		expect(secondsUntil(resendAvailableAt, 25_000)).toBe(35);
	});

	it("rounds a part second up, so it never shows zero while time is left", () => {
		expect(secondsUntil(10_500, 10_000)).toBe(1);
	});

	it("stops at zero once the time has passed", () => {
		expect(secondsUntil(10_000, 12_000)).toBe(0);
	});
});

describe("formatCountdown", () => {
	it("shows minutes and seconds", () => {
		expect(formatCountdown(180)).toBe("03:00");
		expect(formatCountdown(65)).toBe("01:05");
		expect(formatCountdown(0)).toBe("00:00");
		expect(formatCountdown(-4)).toBe("00:00");
	});
});
