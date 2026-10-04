import { describe, expect, it } from "vitest";
import { BLANK_COMPANY, BLANK_CONTACT } from "./form-values";
import {
	companyValidationSchema,
	contactValidationSchema,
} from "./onboarding-validation";

function errorsOf(
	schema: typeof companyValidationSchema | typeof contactValidationSchema,
	values: object,
): Record<string, string> {
	try {
		schema.validateSync(values, { abortEarly: false });
		return {};
	} catch (error) {
		const result: Record<string, string> = {};
		for (const inner of (
			error as { inner: { path: string; message: string }[] }
		).inner) {
			result[inner.path] ??= inner.message;
		}
		return result;
	}
}

const company = {
	...BLANK_COMPANY,
	name: "Acme Media Ltd",
	email: "info@acme.com",
	country: "Egypt",
	countryCode: "EG",
	city: "Cairo",
	telephone: "+20 (22) 123-4567",
};

const contact = {
	...BLANK_CONTACT,
	firstName: "Jane",
	lastName: "Doe",
	mobile: "+201001234567",
};

describe("companyValidationSchema", () => {
	it("accepts a complete company with no address", () => {
		expect(errorsOf(companyValidationSchema, company)).toEqual({});
	});

	it("requires every required field", () => {
		expect(errorsOf(companyValidationSchema, BLANK_COMPANY)).toEqual({
			name: "companyNameRequired",
			email: "companyEmailRequired",
			country: "countryRequired",
			city: "cityRequired",
			telephone: "telephoneRequired",
		});
	});

	it("treats whitespace as empty", () => {
		expect(
			errorsOf(companyValidationSchema, { ...company, name: "   " }).name,
		).toBe("companyNameRequired");
	});

	it("checks the email format", () => {
		expect(
			errorsOf(companyValidationSchema, { ...company, email: "not-an-email" })
				.email,
		).toBe("invalidEmail");
	});

	it("limits telephone to digits, plus, spaces, dashes and parentheses", () => {
		expect(
			errorsOf(companyValidationSchema, { ...company, telephone: "call me" })
				.telephone,
		).toBe("telephoneInvalid");
		expect(
			errorsOf(companyValidationSchema, {
				...company,
				telephone: "0122-345 (6)",
			}).telephone,
		).toBeUndefined();
	});

	it("applies the server's length limits", () => {
		expect(
			errorsOf(companyValidationSchema, { ...company, name: "a".repeat(201) })
				.name,
		).toBe("companyNameMax");
		expect(
			errorsOf(companyValidationSchema, {
				...company,
				telephone: "1".repeat(31),
			}).telephone,
		).toBe("telephoneMax");
		expect(
			errorsOf(companyValidationSchema, {
				...company,
				address: "a".repeat(501),
			}).address,
		).toBe("addressMax");
		expect(
			errorsOf(companyValidationSchema, { ...company, city: "a".repeat(101) })
				.city,
		).toBe("placeMax");
	});
});

describe("contactValidationSchema", () => {
	it("accepts a complete contact with no title", () => {
		expect(errorsOf(contactValidationSchema, contact)).toEqual({});
	});

	it("requires first name, last name and mobile", () => {
		expect(errorsOf(contactValidationSchema, BLANK_CONTACT)).toEqual({
			firstName: "firstNameRequired",
			lastName: "lastNameRequired",
			mobile: "mobileRequired",
		});
	});

	it("gives mobile the same loose character check as telephone", () => {
		expect(
			errorsOf(contactValidationSchema, { ...contact, mobile: "abc" }).mobile,
		).toBe("mobileInvalid");
		expect(
			errorsOf(contactValidationSchema, { ...contact, mobile: "1".repeat(31) })
				.mobile,
		).toBe("mobileMax");
	});

	it("applies the name and title limits", () => {
		expect(
			errorsOf(contactValidationSchema, {
				...contact,
				firstName: "a".repeat(101),
			}).firstName,
		).toBe("personNameMax");
		expect(
			errorsOf(contactValidationSchema, { ...contact, title: "a".repeat(101) })
				.title,
		).toBe("titleMax");
	});
});
