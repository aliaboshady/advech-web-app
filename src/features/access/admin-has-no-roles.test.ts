import { describe, expect, it } from "vitest";
import { adminHasNoRoles } from "./admin-has-no-roles";

describe("adminHasNoRoles", () => {
	it("is true for an Admin with no Roles who is not a super-admin", () => {
		expect(
			adminHasNoRoles({
				isSuperAdmin: false,
				roles: [],
				permissions: [],
			}),
		).toBe(true);
	});

	it("is false for a super-admin even with no Roles", () => {
		expect(
			adminHasNoRoles({
				isSuperAdmin: true,
				roles: [],
				permissions: [],
			}),
		).toBe(false);
	});

	it("is false when the Admin holds a Role", () => {
		expect(
			adminHasNoRoles({
				isSuperAdmin: false,
				roles: [{ id: "role-lookups", name: "Lookup editor" }],
				permissions: ["lookups:manage"],
			}),
		).toBe(false);
	});

	it("is false when access is null", () => {
		expect(adminHasNoRoles(null)).toBe(false);
	});
});
