import { describe, expect, it } from "vitest";
import { adminMayOpenPath, visibleAdminSidebarEntries } from "./admin-sidebar";

const home = { id: "home", path: "/admin" };
const lookups = {
	id: "lookups",
	path: "/admin/lookups",
	permissionKey: "lookups:manage",
};
const catalog = [home, lookups];

describe("visibleAdminSidebarEntries", () => {
	it("shows a super-admin every entry, including ones behind a Permission", () => {
		expect(
			visibleAdminSidebarEntries(
				{ isSuperAdmin: true, roles: [], permissions: [] },
				catalog,
			),
		).toEqual([home, lookups]);
	});

	it("shows nothing when access is null", () => {
		expect(visibleAdminSidebarEntries(null, catalog)).toEqual([]);
	});

	it("shows an Admin with no Roles only the entries that are not gated", () => {
		expect(
			visibleAdminSidebarEntries(
				{ isSuperAdmin: false, roles: [], permissions: [] },
				catalog,
			),
		).toEqual([home]);
	});

	it("hides an entry when that Permission is missing", () => {
		expect(
			visibleAdminSidebarEntries(
				{
					isSuperAdmin: false,
					roles: [{ id: "role-drivers", name: "Drivers" }],
					permissions: ["drivers:read"],
				},
				catalog,
			),
		).toEqual([home]);
	});

	it("hides an entry whose Permission key the UI does not know", () => {
		const unknown = {
			id: "review",
			path: "/admin/review",
			permissionKey: "advertisers:review",
		};
		expect(
			visibleAdminSidebarEntries(
				{
					isSuperAdmin: true,
					roles: [],
					permissions: ["advertisers:review"],
				},
				[home, unknown],
			),
		).toEqual([home]);
	});

	it("lets a super-admin open the home path after a refusal is refetched", () => {
		expect(
			adminMayOpenPath(
				{ isSuperAdmin: true, roles: [], permissions: [] },
				"/admin",
			),
		).toBe(true);
	});

	it("keeps an Admin with no Roles off the home path", () => {
		expect(
			adminMayOpenPath(
				{ isSuperAdmin: false, roles: [], permissions: [] },
				"/admin",
			),
		).toBe(false);
	});

	it("opens a gated path only when that Permission is held", () => {
		const lookups = {
			id: "lookups",
			path: "/admin/lookups",
			permissionKey: "lookups:manage",
		};
		expect(
			adminMayOpenPath(
				{
					isSuperAdmin: false,
					roles: [{ id: "role-lookups", name: "Lookup editor" }],
					permissions: ["lookups:manage"],
				},
				"/admin/lookups",
				[home, lookups],
			),
		).toBe(true);
		expect(
			adminMayOpenPath(
				{
					isSuperAdmin: false,
					roles: [{ id: "role-drivers", name: "Drivers" }],
					permissions: ["drivers:read"],
				},
				"/admin/lookups",
				[home, lookups],
			),
		).toBe(false);
	});

	it("lists home, the Lookup screens and invites from the catalog that ships today", () => {
		const superAdmin = {
			isSuperAdmin: true,
			roles: [{ id: "role-super-admin", name: "Super admin" }],
			permissions: ["lookups:manage", "roles:manage", "admins:invite"],
		};
		expect(
			visibleAdminSidebarEntries(superAdmin).map((entry) => entry.id),
		).toEqual(["home", "objectives", "interests", "venue-types", "invites"]);
		expect(adminMayOpenPath(superAdmin, "/admin/objectives")).toBe(true);
		expect(adminMayOpenPath(superAdmin, "/admin/invites")).toBe(true);
	});

	it("hides the Lookup screens from an Admin without lookups:manage", () => {
		const drivers = {
			isSuperAdmin: false,
			roles: [{ id: "role-drivers", name: "Drivers" }],
			permissions: ["drivers:read"],
		};
		expect(
			visibleAdminSidebarEntries(drivers).map((entry) => entry.id),
		).toEqual(["home"]);
		expect(adminMayOpenPath(drivers, "/admin/objectives")).toBe(false);
		expect(adminMayOpenPath(drivers, "/admin/interests")).toBe(false);
		expect(adminMayOpenPath(drivers, "/admin/venue-types")).toBe(false);
	});

	it("hides invites from an Admin without admins:invite", () => {
		expect(
			visibleAdminSidebarEntries({
				isSuperAdmin: false,
				roles: [{ id: "role-lookups", name: "Lookups" }],
				permissions: ["lookups:manage"],
			}).map((entry) => entry.id),
		).toEqual(["home", "objectives", "interests", "venue-types"]);
	});

	it("opens the invites path only when admins:invite is held", () => {
		const withInvite = {
			isSuperAdmin: false,
			roles: [{ id: "role-invites", name: "Invites" }],
			permissions: ["admins:invite"],
		};
		const withoutInvite = {
			isSuperAdmin: false,
			roles: [{ id: "role-lookups", name: "Lookups" }],
			permissions: ["lookups:manage"],
		};
		expect(adminMayOpenPath(withInvite, "/admin/invites")).toBe(true);
		expect(adminMayOpenPath(withoutInvite, "/admin/invites")).toBe(false);
	});
});
