import { Permission } from "./types";

/**
 * Permissions the picker offers.
 * A key already on the Role that the catalog does not list is kept, so an
 * unrecognised Permission is shown rather than dropped.
 */
export function permissionPickerItems(
	catalog: readonly Permission[],
	selectedKeys: readonly string[],
): readonly Permission[] {
	const knownKeys = new Set(catalog.map((permission) => permission.key));
	const unknownKeys = selectedKeys.filter(
		(key, index) => !knownKeys.has(key) && selectedKeys.indexOf(key) === index,
	);
	const unknownItems = unknownKeys.map((key) => ({ key, description: "" }));
	return [...catalog, ...unknownItems];
}
