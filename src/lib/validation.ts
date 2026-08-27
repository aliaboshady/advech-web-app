import * as Yup from "yup";

export const validationSchema = {
	login: Yup.object({
		email: Yup.string().email("INVALID_EMAIL").required("EMAIL_REQUIRED"),
		password: Yup.string()
			.required("PASSWORD_REQUIRED")
			.min(12, "PASSWORD_MIN"),
	}),

	signup: Yup.object({
		email: Yup.string().email("INVALID_EMAIL").required("EMAIL_REQUIRED"),
		password: Yup.string()
			.required("PASSWORD_REQUIRED")
			.min(12, "PASSWORD_MIN"),
		confirmPassword: Yup.string()
			.required("CONFIRM_PASSWORD_REQUIRED")
			.oneOf([Yup.ref("password")], "PASSWORDS_MUST_MATCH"),
	}),

	verifyEmail: Yup.object({
		email: Yup.string().email("INVALID_EMAIL").required("EMAIL_REQUIRED"),
		code: Yup.string().required("CODE_REQUIRED"),
	}),
};
