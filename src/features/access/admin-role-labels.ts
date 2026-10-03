import { AdminAccess } from "./admin-access";

/**
 * Role names for the shell. Display only; never a gating input.
 */
export function adminRoleLabels(access: AdminAccess | null): readonly string[] {
	if (access === null) {
		return [];
	}
	return access.roles.map((role) => role.name);
}
