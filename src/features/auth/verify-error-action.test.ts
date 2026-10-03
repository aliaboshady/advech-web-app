import { describe, expect, it } from "vitest";
import { verifyErrorAction } from "./verify-error-action";

const signedOut = { hasSession: false };
const signedIn = { hasSession: true };

describe("verifyErrorAction", () => {
	it("keeps a wrong code on the screen so the user can type it again", () => {
		expect(verifyErrorAction("OTP_INVALID", signedOut)).toBe("stay");
	});

	it("offers resend when the code expired or ran out of attempts", () => {
		expect(verifyErrorAction("OTP_EXPIRED", signedOut)).toBe("resend");
		expect(verifyErrorAction("OTP_MAX_ATTEMPTS_EXCEEDED", signedOut)).toBe(
			"resend",
		);
	});

	it("goes back to the newest handle when this one was replaced", () => {
		expect(verifyErrorAction("VERIFICATION_HANDLE_UNKNOWN", signedOut)).toBe(
			"use-latest-handle",
		);
	});

	it("continues into the app when the attempt already succeeded and a session exists", () => {
		expect(verifyErrorAction("VERIFICATION_HANDLE_CONSUMED", signedIn)).toBe(
			"continue",
		);
	});

	it("goes to login when the attempt already succeeded and there is no session", () => {
		expect(verifyErrorAction("VERIFICATION_HANDLE_CONSUMED", signedOut)).toBe(
			"login",
		);
	});

	it("restarts signup when the handle is too old", () => {
		expect(verifyErrorAction("VERIFICATION_HANDLE_EXPIRED", signedOut)).toBe(
			"restart-signup",
		);
	});

	it("stays put for a suspended account, a throttled request and anything unknown", () => {
		expect(verifyErrorAction("USER_SUSPENDED", signedOut)).toBe("stay");
		expect(verifyErrorAction("TOO_MANY_REQUESTS", signedOut)).toBe("stay");
		expect(verifyErrorAction("SOMETHING_NEW", signedOut)).toBe("stay");
	});
});
