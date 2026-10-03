import { AdminAccess } from "./admin-access";
import { mayAdmin } from "./may-admin";

export type AdminSidebarLabelKey = "admin.sidebar.home";

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
