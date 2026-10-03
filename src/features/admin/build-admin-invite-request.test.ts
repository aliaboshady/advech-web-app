import { describe, expect, it } from "vitest";
import { buildAdminInviteRequest } from "./build-admin-invite-request";

describe("buildAdminInviteRequest", () => {
	it("sends the trimmed email", () => {
		expect(buildAdminInviteRequest("  admin@advech.com  ")).toEqual({
			ok: true,
			request: { email: "admin@advech.com" },
		});
	});

	it("refuses a blank email", () => {
		expect(buildAdminInviteRequest("   ")).toEqual({
			ok: false,
			reason: "email-required",
		});
	});

	it("refuses an email that is not an address", () => {
		expect(buildAdminInviteRequest("not-an-email")).toEqual({
			ok: false,
			reason: "email-invalid",
		});
	});
});
