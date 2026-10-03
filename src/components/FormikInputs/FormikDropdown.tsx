import { FormikProps } from "formik";
import { useState } from "react";
import Dropdown from "@/components/inputs/Dropdown";
import { FormField } from "@/features/campaigns/components/Forms/FormField";
import { Item } from "@/types";

type Props = {
	formik: FormikProps<any>;
	/** The Formik field that holds the selected item's `value`. */
	name: string;
	/** The field whose validation error belongs here, when it is not `name`. */
	errorField?: string;
	label: string;
	items: Item[];
	/** Translation keys; the dropdown translates them. */
	placeholder: string;
	searchPlaceholder: string;
	disabled?: boolean;
	loading?: boolean;
	required?: boolean;
	hint?: string;
	/** Runs after the value is set, e.g. to reset a dependent field. */
	onSelect?: (item: Item | undefined) => void;
};

/**
 * A searchable single-select wired to Formik. The list is filtered here, in
 * the browser, as the user types. Item labels are data (country and city
 * names), so they are shown as nodes and never run through translation.
 */
export function FormikDropdown({
	formik,
	name,
	errorField = name,
	label,
	items,
	placeholder,
	searchPlaceholder,
	disabled,
	loading,
	required,
	hint,
	onSelect,
}: Props) {
	const [search, setSearch] = useState("");
	const selected: string = formik.values[name] ?? "";
	const query = search.trim().toLocaleLowerCase();
	const visible = (
		query
			? items.filter((item) => item.label.toLocaleLowerCase().includes(query))
			: items
	).map((item) => ({
		...item,
		labelNode: <span className="truncate">{item.label}</span>,
	}));
	const selectedItem = items.find((item) => item.value === selected);
	const error =
		formik.touched[errorField] && formik.errors[errorField]
			? String(formik.errors[errorField])
			: undefined;

	return (
		<FormField
			label={label}
			required={required}
			htmlFor={name}
			error={error}
			hint={hint}
		>
			<Dropdown
				selected={selected}
				setSelected={(value: string) => {
					formik.setFieldValue(name, value ?? "");
					formik.setFieldTouched(errorField, true, false);
					setSearch("");
					onSelect?.(items.find((item) => item.value === value));
				}}
				items={visible}
				placeholder={placeholder}
				placeholderValueSingle={selectedItem?.label}
				searchable
				searchValue={search}
				setSearchValue={setSearch}
				searchPlaceholder={searchPlaceholder}
				disabled={disabled}
				loadingData={loading}
				error={error}
				hideErrorMessage
			/>
		</FormField>
	);
}
