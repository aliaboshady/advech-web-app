import { RoleFormValues, RoleWritePayload } from "./types";

function uniquePermissionKeys(keys: readonly string[]): string[] {
	return keys.filter((key, index) => keys.indexOf(key) === index);
}

/**
 * Create body. A blank description is omitted.
 * Permissions are the chosen set.
 */
export function buildCreateRolePayload(
	values: RoleFormValues,
): RoleWritePayload {
	const description = values.description.trim();
	const payload: RoleWritePayload = {
		name: values.name.trim(),
		permissions: uniquePermissionKeys(values.permissions),
	};
	if (description.length === 0) {
		return payload;
	}
	return { ...payload, description };
}

/**
 * Edit body. Permissions are the full list the Admin sees, not a diff.
 * An empty description is sent so clearing one is saved.
 */
export function buildUpdateRolePayload(
	values: RoleFormValues,
): RoleWritePayload {
	return {
		name: values.name.trim(),
		description: values.description.trim(),
		permissions: uniquePermissionKeys(values.permissions),
	};
}
