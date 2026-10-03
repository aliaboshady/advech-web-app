import { describe, expect, it } from "vitest";
import { permissionPickerItems } from "./permission-picker-items";

const catalog = [
	{
		key: "roles:manage",
		description: "Create and edit Roles",
	},
	{
		key: "lookups:manage",
		description: "Create, edit and deactivate Lookups",
	},
];

describe("permissionPickerItems", () => {
	it("keeps each catalog Permission with its description", () => {
		expect(permissionPickerItems(catalog, ["roles:manage"])).toEqual(catalog);
	});

	it("shows a Permission key the catalog does not list", () => {
		expect(
			permissionPickerItems(catalog, ["roles:manage", "billing:manage"]),
		).toEqual([...catalog, { key: "billing:manage", description: "" }]);
	});

	it("does not repeat an unrecognised key that appears twice", () => {
		expect(
			permissionPickerItems(catalog, ["billing:manage", "billing:manage"]),
		).toEqual([...catalog, { key: "billing:manage", description: "" }]);
	});
});
