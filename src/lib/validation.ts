import * as Yup from "yup";

export const validationSchema = {
	login: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
		password: Yup.string().required("passwordRequired").min(12, "passwordMin"),
	}),

	signup: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
		password: Yup.string().required("passwordRequired").min(12, "passwordMin"),
		confirmPassword: Yup.string()
			.required("confirmPasswordRequired")
			.oneOf([Yup.ref("password")], "passwordsMustMatch"),
	}),

	verifyEmail: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
		code: Yup.string().required("codeRequired"),
	}),

	requestPasswordReset: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
	}),

	confirmPasswordReset: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
		code: Yup.string().required("codeRequired"),
		newPassword: Yup.string()
			.required("passwordRequired")
			.min(12, "passwordMin"),
	}),
};
