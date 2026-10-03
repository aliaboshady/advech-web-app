import { AdminAccess } from "./admin-access";

/**
 * Whether this Admin has no Roles.
 * A super-admin is never in this state: they may open every screen.
 * Null access is not an Admin, so this is not their screen.
 */
export function adminHasNoRoles(access: AdminAccess | null): boolean {
	if (access === null || access.isSuperAdmin) {
		return false;
	}
	return access.roles.length === 0;
}
