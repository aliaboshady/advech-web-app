import { describe, expect, it } from "vitest";
import { resolveBypassMe } from "./resolve-bypass-me";
import { mockMe } from "./staticKeys";

describe("resolveBypassMe", () => {
	it("keeps the Advertiser mock, with no access, unless an admin is requested", () => {
		const user = resolveBypassMe(undefined);
		expect(user).toBe(mockMe);
		expect(user.actorType).toBe("ADVERTISER");
		expect(user.access).toBeNull();
	});

	it("returns an Admin with access when the bypass actor is admin", () => {
		const user = resolveBypassMe("admin");
		expect(user.actorType).toBe("ADMIN");
		expect(user.access).toEqual({
			isSuperAdmin: true,
			roles: [{ id: "role-super-admin", name: "Super admin" }],
			permissions: [
				"drivers:read",
				"drivers:approve",
				"documents:review",
				"roles:manage",
				"admins:invite",
				"lookups:manage",
			],
		});
	});

	it("does not treat any other actor value as an Admin", () => {
		expect(resolveBypassMe("advertiser")).toBe(mockMe);
		expect(resolveBypassMe("ADMIN").actorType).toBe("ADVERTISER");
	});
});
