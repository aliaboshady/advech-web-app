import * as Yup from "yup";
import { lookupCodeIssue, lookupCodeMessageKey } from "./lookup-code";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const SORT_ORDER_MAX = 100000;
const WHOLE_NUMBER = /^(0|[1-9]\d*)$/;

export type LookupFormMode = "create" | "edit";

/** Client-side limits for a Lookup entry, matching the admin contract. */
export function lookupEntryValidationSchema(mode: LookupFormMode) {
	return Yup.object({
		code:
			mode === "edit"
				? Yup.string()
				: Yup.string()
						.test("lookup-code", (value, context) => {
							const issue = lookupCodeIssue((value ?? "").trim());
							if (issue === null) {
								return true;
							}
							return context.createError({
								message: lookupCodeMessageKey(issue),
							});
						}),
		name: Yup.string()
			.transform((value: string) => value.trim())
			.required("lookupNameRequired")
			.min(NAME_MIN_LENGTH, "lookupNameMin")
			.max(NAME_MAX_LENGTH, "lookupNameMax"),
		description: Yup.string()
			.transform((value: string) => value.trim())
			.max(DESCRIPTION_MAX_LENGTH, "lookupDescriptionMax"),
		sortOrder: Yup.string().test(
			"sort-order",
			"lookupSortOrderInvalid",
			(value) => {
				const trimmed = (value ?? "").trim();
				if (!trimmed) {
					return true;
				}
				if (!WHOLE_NUMBER.test(trimmed)) {
					return false;
				}
				return Number(trimmed) <= SORT_ORDER_MAX;
			},
		),
	});
}
