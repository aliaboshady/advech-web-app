import { deadlinesFrom, type OtpTimings } from "./otp-timers";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const VERIFY_STATE_KEY = "verify-email-state";
export const RESET_STATE_KEY = "password-reset-state";

/**
 * What a code screen keeps between pages and refreshes. `token` is the
 * Verification handle (verify only); it names the attempt and is not a
 * credential. Deadlines are absolute so a refresh does not reset them.
 */
export type OtpState = {
	email: string;
	token?: string;
	expiresAt: number;
	resendAvailableAt: number;
	devCode?: string;
};

/** Signup, resend and password-reset-request responses share this shape. */
export type OtpResponse = OtpTimings & {
	token?: string;
	devCode?: string;
};

/**
 * The state after a signup, resend or reset-request response. A present
 * `token` always replaces the stored handle (the server rotates it even inside
 * the cooldown); an absent one keeps the handle the screen already has.
 */
export function otpStateFromResponse(input: {
	email: string;
	response: OtpResponse;
	nowMs: number;
	previous?: OtpState;
}): OtpState {
	const { email, response, nowMs, previous } = input;
	return {
		email,
		token: response.token ?? previous?.token,
		...deadlinesFrom(nowMs, response),
		devCode: response.devCode,
	};
}

function finiteNumber(value: unknown): number {
	return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function optionalString(value: unknown): string | undefined {
	return typeof value === "string" && value !== "" ? value : undefined;
}

export function readOtpState(
	storage: StorageLike,
	key: string,
): OtpState | null {
	try {
		const raw = storage.getItem(key);
		if (raw === null) {
			return null;
		}
		const parsed: unknown = JSON.parse(raw);
		if (
			typeof parsed !== "object" ||
			parsed === null ||
			Array.isArray(parsed)
		) {
			return null;
		}
		const value = parsed as Record<string, unknown>;
		return {
			email: typeof value.email === "string" ? value.email : "",
			token: optionalString(value.token),
			// A state stored as raw seconds by an older build has no deadlines: due now.
			expiresAt: finiteNumber(value.expiresAt),
			resendAvailableAt: finiteNumber(value.resendAvailableAt),
			devCode: optionalString(value.devCode),
		};
	} catch {
		return null;
	}
}

export function writeOtpState(
	storage: StorageLike,
	key: string,
	state: OtpState,
): void {
	try {
		storage.setItem(key, JSON.stringify(state));
	} catch {
		// Without storage the screen still works until it is refreshed.
	}
}

export function clearOtpState(storage: StorageLike, key: string): void {
	try {
		storage.removeItem(key);
	} catch {
		// Nothing to clear if storage is blocked.
	}
}

/** The server's `devCode`, filled in only in development. Never required. */
export function prefillCode(state: OtpState | null, isDev: boolean): string {
	return isDev ? (state?.devCode ?? "") : "";
}
