import { describe, expect, it } from "vitest";
import { adminRoleLabels } from "./admin-role-labels";

describe("adminRoleLabels", () => {
	it("returns the Role names and nothing else", () => {
		expect(
			adminRoleLabels({
				isSuperAdmin: false,
				roles: [
					{ id: "role-lookups", name: "Lookup editor" },
					{ id: "role-drivers", name: "Drivers" },
				],
				permissions: ["lookups:manage"],
			}),
		).toEqual(["Lookup editor", "Drivers"]);
	});

	it("returns nothing for a super-admin who has no Roles", () => {
		expect(
			adminRoleLabels({ isSuperAdmin: true, roles: [], permissions: [] }),
		).toEqual([]);
	});

	it("returns nothing when access is null", () => {
		expect(adminRoleLabels(null)).toEqual([]);
	});
});
