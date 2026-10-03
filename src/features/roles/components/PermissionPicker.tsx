import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { permissionPickerItems } from "../permission-picker-items";
import { Permission } from "../types";

type PermissionPickerProps = {
	readonly catalog: readonly Permission[];
	readonly selectedKeys: readonly string[];
	readonly onChange: (keys: string[]) => void;
};

function togglePermission(
	selectedKeys: readonly string[],
	key: string,
): string[] {
	if (selectedKeys.includes(key)) {
		return selectedKeys.filter((item) => item !== key);
	}
	return [...selectedKeys, key];
}

/** Chooses the Permissions a Role grants. Descriptions come from the catalog. */
export function PermissionPicker({
	catalog,
	selectedKeys,
	onChange,
}: PermissionPickerProps) {
	const { t } = useTranslation();
	const items = permissionPickerItems(catalog, selectedKeys);
	return (
		<fieldset className="flex flex-col gap-3">
			<legend className="text-sm font-medium">
				{t("admin.roles.permissions")}
			</legend>
			<p className="text-sm text-muted-foreground">
				{t("admin.roles.permissionsHint")}
			</p>
			<ul className="flex flex-col gap-3">
				{items.map((item) => {
					const inputId = `permission-${item.key}`;
					const description =
						item.description || t("admin.roles.unknownPermission");
					return (
						<li key={item.key} className="flex items-start gap-3">
							<Checkbox
								id={inputId}
								checked={selectedKeys.includes(item.key)}
								onCheckedChange={() =>
									onChange(togglePermission(selectedKeys, item.key))
								}
								className="mt-0.5"
							/>
							<Label
								htmlFor={inputId}
								className="flex flex-col items-start gap-1"
							>
								<span>{item.key}</span>
								<span className="text-xs font-normal text-muted-foreground">
									{description}
								</span>
							</Label>
						</li>
					);
				})}
			</ul>
		</fieldset>
	);
}
