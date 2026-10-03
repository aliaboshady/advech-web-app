import * as Yup from "yup";
import { LIMITS } from "./form-values";

/** Digits, `+`, spaces, dashes and parentheses. No phone library on purpose. */
const PHONE_PATTERN = /^[0-9+\-() ]+$/;

function phone(requiredKey: string, invalidKey: string, maxKey: string) {
	return Yup.string()
		.trim()
		.required(requiredKey)
		.matches(PHONE_PATTERN, invalidKey)
		.max(LIMITS.phone, maxKey);
}

/** Client-side limits for Company details, matching the server's. Messages are `errors.*` keys. */
export const companyValidationSchema = Yup.object({
	name: Yup.string()
		.trim()
		.required("companyNameRequired")
		.max(LIMITS.companyName, "companyNameMax"),
	email: Yup.string()
		.trim()
		.required("companyEmailRequired")
		.email("invalidEmail"),
	country: Yup.string()
		.trim()
		.required("countryRequired")
		.max(LIMITS.place, "placeMax"),
	city: Yup.string()
		.trim()
		.required("cityRequired")
		.max(LIMITS.place, "placeMax"),
	telephone: phone("telephoneRequired", "telephoneInvalid", "telephoneMax"),
	address: Yup.string().trim().max(LIMITS.address, "addressMax"),
});

/** Client-side limits for Contact details. Title stays optional. */
export const contactValidationSchema = Yup.object({
	firstName: Yup.string()
		.trim()
		.required("firstNameRequired")
		.max(LIMITS.personName, "personNameMax"),
	lastName: Yup.string()
		.trim()
		.required("lastNameRequired")
		.max(LIMITS.personName, "personNameMax"),
	mobile: phone("mobileRequired", "mobileInvalid", "mobileMax"),
	title: Yup.string().trim().max(LIMITS.title, "titleMax"),
});
