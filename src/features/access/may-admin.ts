import { AdminAccess } from "./admin-access";
import { PERMISSION_KEYS } from "./permission-keys";

const knownPermissionKeys: ReadonlySet<string> = new Set(PERMISSION_KEYS);

/**
 * Whether this Admin may do the given thing.
 * Role names are ignored. An unknown key is not an error; the answer is no.
 * Null access (anyone who is not an Admin) is no.
 */
export function mayAdmin(
	access: AdminAccess | null,
	permissionKey: string,
): boolean {
	if (access === null) {
		return false;
	}
	if (!knownPermissionKeys.has(permissionKey)) {
		return false;
	}
	if (access.isSuperAdmin) {
		return true;
	}
	return access.permissions.includes(permissionKey);
}
