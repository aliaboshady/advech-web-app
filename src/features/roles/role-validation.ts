import * as Yup from "yup";

const ROLE_NAME_MIN_LENGTH = 2;
const ROLE_NAME_MAX_LENGTH = 100;
const ROLE_DESCRIPTION_MAX_LENGTH = 500;

/** Client-side limits for a Role name and description, matching the backend. */
export const roleValidationSchema = Yup.object({
	name: Yup.string()
		.transform((value: string) => value.trim())
		.required("roleNameRequired")
		.min(ROLE_NAME_MIN_LENGTH, "roleNameMin")
		.max(ROLE_NAME_MAX_LENGTH, "roleNameMax"),
	description: Yup.string()
		.transform((value: string) => value.trim())
		.max(ROLE_DESCRIPTION_MAX_LENGTH, "roleDescriptionMax"),
	permissions: Yup.array().of(Yup.string().required()).default([]),
});
