import { describe, expect, it } from "vitest";
import { buildConfirmAdminPasswordResetPayload } from "./build-confirm-admin-password-reset-payload";

describe("buildConfirmAdminPasswordResetPayload", () => {
	it("sends the reset token and a password of 12 characters", () => {
		const built = buildConfirmAdminPasswordResetPayload({
			token: "  reset-token  ",
			password: "abcdefghijkl",
		});
		expect(built).toEqual({
			ok: true,
			payload: { token: "reset-token", password: "abcdefghijkl" },
		});
	});

	it("accepts a password of 128 characters", () => {
		const built = buildConfirmAdminPasswordResetPayload({
			token: "reset-token",
			password: "p".repeat(128),
		});
		expect(built.ok).toBe(true);
	});

	it("refuses a password shorter than 12 or longer than 128 characters", () => {
		const tooShort = buildConfirmAdminPasswordResetPayload({
			token: "reset-token",
			password: "short-pass",
		});
		const tooLong = buildConfirmAdminPasswordResetPayload({
			token: "reset-token",
			password: "p".repeat(129),
		});
		const empty = buildConfirmAdminPasswordResetPayload({
			token: "reset-token",
			password: "",
		});
		expect(tooShort).toEqual({
			ok: false,
			fields: { password: "passwordMin" },
		});
		expect(tooLong).toEqual({
			ok: false,
			fields: { password: "passwordMax" },
		});
		expect(empty).toEqual({
			ok: false,
			fields: { password: "passwordRequired" },
		});
	});

	it("does not build a payload when the reset token is missing", () => {
		const built = buildConfirmAdminPasswordResetPayload({
			token: "   ",
			password: "abcdefghijkl",
		});
		expect(built).toEqual({ ok: false, fields: {} });
	});
});
