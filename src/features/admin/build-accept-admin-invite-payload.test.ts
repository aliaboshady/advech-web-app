import { describe, expect, it } from "vitest";
import { buildAcceptAdminInvitePayload } from "./build-accept-admin-invite-payload";

const validInvite = {
	token: "invite-token",
	firstName: "Jane",
	lastName: "Doe",
	password: "abcdefghijkl",
};

describe("buildAcceptAdminInvitePayload", () => {
	it("sends the invite token, trimmed names and a password of 12 characters", () => {
		const built = buildAcceptAdminInvitePayload({
			...validInvite,
			firstName: "  Jane  ",
			lastName: "  Doe  ",
		});
		expect(built).toEqual({
			ok: true,
			payload: {
				token: "invite-token",
				firstName: "Jane",
				lastName: "Doe",
				password: "abcdefghijkl",
			},
		});
	});

	it("accepts a password of 128 characters and a name of 100 characters", () => {
		const built = buildAcceptAdminInvitePayload({
			...validInvite,
			firstName: "J".repeat(100),
			lastName: "D".repeat(100),
			password: "p".repeat(128),
		});
		expect(built.ok).toBe(true);
	});

	it("refuses a password shorter than 12 or longer than 128 characters", () => {
		const tooShort = buildAcceptAdminInvitePayload({
			...validInvite,
			password: "short-pass",
		});
		const tooLong = buildAcceptAdminInvitePayload({
			...validInvite,
			password: "p".repeat(129),
		});
		const empty = buildAcceptAdminInvitePayload({
			...validInvite,
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

	it("refuses a blank name and a name longer than 100 characters", () => {
		const blank = buildAcceptAdminInvitePayload({
			...validInvite,
			firstName: "   ",
			lastName: "",
		});
		const tooLong = buildAcceptAdminInvitePayload({
			...validInvite,
			firstName: "J".repeat(101),
			lastName: `  ${"D".repeat(101)}  `,
		});
		expect(blank).toEqual({
			ok: false,
			fields: { firstName: "firstNameRequired", lastName: "lastNameRequired" },
		});
		expect(tooLong).toEqual({
			ok: false,
			fields: { firstName: "adminNameMax", lastName: "adminNameMax" },
		});
	});

	it("does not build a payload when the invite token is missing", () => {
		const built = buildAcceptAdminInvitePayload({
			...validInvite,
			token: "   ",
		});
		expect(built).toEqual({ ok: false, fields: {} });
	});
});
