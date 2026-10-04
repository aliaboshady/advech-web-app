import * as Yup from "yup";

/** The emailed code is exactly six digits. */
const OTP_CODE = /^\d{6}$/;

export const validationSchema = {
	// Login has no minimum password length; only signup and reset enforce one.
	login: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
		password: Yup.string().required("passwordRequired"),
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
		code: Yup.string()
			.required("codeRequired")
			.matches(OTP_CODE, "codeInvalid"),
	}),

	requestPasswordReset: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
	}),

	adminInvite: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
	}),

	confirmPasswordReset: Yup.object({
		email: Yup.string().email("invalidEmail").required("emailRequired"),
		code: Yup.string()
			.required("codeRequired")
			.matches(OTP_CODE, "codeInvalid"),
		newPassword: Yup.string()
			.required("passwordRequired")
			.min(12, "passwordMin")
			.max(128, "passwordMax"),
	}),
};
