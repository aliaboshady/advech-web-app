import * as Yup from "yup";

export const validationSchema = {
	login: Yup.object({
		email: Yup.string().email("INVALID_EMAIL").required("EMAIL_REQUIRED"),
		password: Yup.string()
			.required("PASSWORD_REQUIRED")
			.min(12, "PASSWORD_MIN"),
	}),
};
