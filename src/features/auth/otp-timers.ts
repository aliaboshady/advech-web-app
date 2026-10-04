export type OtpTimings = {
	expiresInSeconds?: number;
	resendAvailableInSeconds?: number;
};

/** When the code expires and when resend opens, as epoch milliseconds. */
export type OtpDeadlines = {
	expiresAt: number;
	resendAvailableAt: number;
};

function secondsToMs(seconds: number | undefined): number {
	return typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0
		? seconds * 1000
		: 0;
}

/**
 * Pins the server's relative seconds to a clock time. Stored as seconds, the
 * cooldown would restart on every refresh; stored as a time, it keeps running.
 * The numbers come from the response, never from constants.
 */
export function deadlinesFrom(
	nowMs: number,
	timings: OtpTimings,
): OtpDeadlines {
	return {
		expiresAt: nowMs + secondsToMs(timings.expiresInSeconds),
		resendAvailableAt: nowMs + secondsToMs(timings.resendAvailableInSeconds),
	};
}

/** Whole seconds left until a deadline, rounded up, never below zero. */
export function secondsUntil(deadlineMs: number, nowMs: number): number {
	return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

export function formatCountdown(seconds: number): string {
	const safe = Math.max(0, seconds);
	const minutes = Math.floor(safe / 60);
	const rest = safe % 60;
	return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
