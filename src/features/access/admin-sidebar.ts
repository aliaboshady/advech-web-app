import { AdminAccess } from "./admin-access";
import { adminHasNoRoles } from "./admin-has-no-roles";
import { mayAdmin } from "./may-admin";

export type AdminSidebarLabelKey =
	| "admin.sidebar.home"
	| "admin.sidebar.invites";

export type AdminSidebarEntry = {
	readonly id: string;
	readonly path: string;
	readonly permissionKey?: string;
	readonly labelKey?: AdminSidebarLabelKey;
};

/**
 * Sidebar entries that exist today. Later screens append an entry here.
 * An entry with no Permission is the home entry and is not gated.
 */
export const adminSidebarCatalog: readonly AdminSidebarEntry[] = [
	{ id: "home", path: "/admin", labelKey: "admin.sidebar.home" },
	{
		id: "invites",
		path: "/admin/invites",
		permissionKey: "admins:invite",
		labelKey: "admin.sidebar.invites",
	},
];

/**
 * Sidebar entries this Admin may open.
 * Asks the gating function; never reads Role names.
 */
export function visibleAdminSidebarEntries(
	access: AdminAccess | null,
	catalog: readonly AdminSidebarEntry[] = adminSidebarCatalog,
): readonly AdminSidebarEntry[] {
	return catalog.filter((entry) => {
		if (access === null) {
			return false;
		}
		if (entry.permissionKey === undefined) {
			return true;
		}
		return mayAdmin(access, entry.permissionKey);
	});
}

function entryMatchesPath(entry: AdminSidebarEntry, pathname: string): boolean {
	if (entry.path === "/admin") {
		return pathname === "/admin";
	}
	return pathname === entry.path || pathname.startsWith(`${entry.path}/`);
}

/**
 * Whether this Admin may see the page at `pathname` after `me` is refetched.
 * An ungated entry such as home is open unless the Admin has no Roles.
 */
export function adminMayOpenPath(
	access: AdminAccess | null,
	pathname: string,
	catalog: readonly AdminSidebarEntry[] = adminSidebarCatalog,
): boolean {
	if (access === null || adminHasNoRoles(access)) {
		return false;
	}
	const matches = catalog.filter((entry) => entryMatchesPath(entry, pathname));
	const entry = matches.sort(
		(left, right) => right.path.length - left.path.length,
	)[0];
	if (entry === undefined) {
		return false;
	}
	if (entry.permissionKey === undefined) {
		return true;
	}
	return mayAdmin(access, entry.permissionKey);
}
