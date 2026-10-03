import { describe, expect, it } from "vitest";
import {
	clearOtpState,
	type OtpState,
	otpStateFromResponse,
	prefillCode,
	readOtpState,
	writeOtpState,
} from "./otp-state";

function memoryStorage() {
	const data = new Map<string, string>();
	return {
		data,
		getItem: (key: string) => data.get(key) ?? null,
		setItem: (key: string, value: string) => {
			data.set(key, value);
		},
		removeItem: (key: string) => {
			data.delete(key);
		},
	};
}

const NOW = 1_000_000;

describe("otpStateFromResponse", () => {
	it("stores the handle and absolute deadlines from the response", () => {
		expect(
			otpStateFromResponse({
				email: "a@b.com",
				response: {
					token: "handle-1",
					expiresInSeconds: 180,
					resendAvailableInSeconds: 60,
				},
				nowMs: NOW,
			}),
		).toEqual({
			email: "a@b.com",
			token: "handle-1",
			expiresAt: NOW + 180_000,
			resendAvailableAt: NOW + 60_000,
			devCode: undefined,
		});
	});

	it("replaces the stored handle whenever the response carries one, even inside the cooldown", () => {
		const previous: OtpState = {
			email: "a@b.com",
			token: "handle-1",
			expiresAt: NOW + 100_000,
			resendAvailableAt: NOW + 30_000,
		};
		const next = otpStateFromResponse({
			email: "a@b.com",
			response: {
				token: "handle-2",
				expiresInSeconds: 100,
				resendAvailableInSeconds: 30,
			},
			nowMs: NOW,
			previous,
		});
		expect(next.token).toBe("handle-2");
	});

	it("keeps the old handle when the response carries none", () => {
		const previous: OtpState = {
			email: "a@b.com",
			token: "handle-1",
			expiresAt: 0,
			resendAvailableAt: 0,
		};
		const next = otpStateFromResponse({
			email: "a@b.com",
			response: { expiresInSeconds: 0, resendAvailableInSeconds: 60 },
			nowMs: NOW,
			previous,
		});
		expect(next.token).toBe("handle-1");
		expect(next.resendAvailableAt).toBe(NOW + 60_000);
	});

	it("has no handle when none was ever issued", () => {
		const next = otpStateFromResponse({
			email: "a@b.com",
			response: { resendAvailableInSeconds: 60 },
			nowMs: NOW,
		});
		expect(next.token).toBeUndefined();
	});
});

describe("stored OTP state", () => {
	it("survives a refresh with its deadlines intact", () => {
		const storage = memoryStorage();
		const state: OtpState = {
			email: "a@b.com",
			token: "handle-1",
			expiresAt: NOW + 180_000,
			resendAvailableAt: NOW + 60_000,
			devCode: "123456",
		};
		writeOtpState(storage, "k", state);
		expect(readOtpState(storage, "k")).toEqual(state);
	});

	it("is null when nothing was stored or it cannot be read", () => {
		const storage = memoryStorage();
		expect(readOtpState(storage, "k")).toBeNull();
		storage.setItem("k", "{oops");
		expect(readOtpState(storage, "k")).toBeNull();
		storage.setItem("k", JSON.stringify(["not", "an", "object"]));
		expect(readOtpState(storage, "k")).toBeNull();
	});

	it("reads an old raw-seconds state as already expired instead of failing", () => {
		const storage = memoryStorage();
		storage.setItem(
			"k",
			JSON.stringify({
				email: "a@b.com",
				token: "handle-1",
				expiresInSeconds: 120,
				resendAvailableInSeconds: 40,
			}),
		);
		expect(readOtpState(storage, "k")).toEqual({
			email: "a@b.com",
			token: "handle-1",
			expiresAt: 0,
			resendAvailableAt: 0,
			devCode: undefined,
		});
	});

	it("is cleared on request", () => {
		const storage = memoryStorage();
		writeOtpState(storage, "k", {
			email: "a@b.com",
			expiresAt: 0,
			resendAvailableAt: 0,
		});
		clearOtpState(storage, "k");
		expect(readOtpState(storage, "k")).toBeNull();
	});
});

describe("prefillCode", () => {
	const state: OtpState = {
		email: "a@b.com",
		expiresAt: 0,
		resendAvailableAt: 0,
		devCode: "123456",
	};

	it("fills the dev code in development only", () => {
		expect(prefillCode(state, true)).toBe("123456");
		expect(prefillCode(state, false)).toBe("");
	});

	it("is blank when the server sent no dev code", () => {
		expect(prefillCode({ ...state, devCode: undefined }, true)).toBe("");
		expect(prefillCode(null, true)).toBe("");
	});
});
