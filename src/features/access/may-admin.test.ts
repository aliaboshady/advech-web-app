import { describe, expect, it } from "vitest";
import { mayAdmin } from "./may-admin";

const lookupsRole = { id: "role-lookups", name: "Lookup editor" };

describe("mayAdmin", () => {
	it("says no when access is null", () => {
		expect(mayAdmin(null, "lookups:manage")).toBe(false);
	});

	it("says yes when the Effective permissions include the key", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: false,
					roles: [lookupsRole],
					permissions: ["lookups:manage"],
				},
				"lookups:manage",
			),
		).toBe(true);
	});

	it("says no when the key is missing", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: false,
					roles: [lookupsRole],
					permissions: ["drivers:read"],
				},
				"lookups:manage",
			),
		).toBe(false);
	});

	it("ignores an unknown key", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: false,
					roles: [lookupsRole],
					permissions: ["lookups:manage", "advertisers:review"],
				},
				"advertisers:review",
			),
		).toBe(false);
	});

	it("lets a super-admin do a known thing with no Roles", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: true,
					roles: [],
					permissions: [],
				},
				"roles:manage",
			),
		).toBe(true);
	});

	it("still ignores an unknown key for a super-admin", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: true,
					roles: [],
					permissions: ["drivers:read"],
				},
				"advertisers:review",
			),
		).toBe(false);
	});

	it("says no for an Admin with no Roles", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: false,
					roles: [],
					permissions: [],
				},
				"admins:invite",
			),
		).toBe(false);
	});

	it("does not grant a permission because a Role is named like that key", () => {
		expect(
			mayAdmin(
				{
					isSuperAdmin: false,
					roles: [{ id: "role-name", name: "lookups:manage" }],
					permissions: [],
				},
				"lookups:manage",
			),
		).toBe(false);
	});
});
