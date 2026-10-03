import type { CompanyFormValues, ContactFormValues } from "./form-values";

export type CompanySection = {
	name: string;
	email: string;
	country: string;
	city: string;
	telephone: string;
	address?: string;
};

export type ContactSection = {
	firstName: string;
	lastName: string;
	mobile: string;
	title?: string;
};

/** Body of `PUT /advertiser/onboarding/form`: one section, or both. */
export type SaveOnboardingFormPayload = {
	company?: CompanySection;
	contact?: ContactSection;
};

function optional(value: string): string | undefined {
	const trimmed = value.trim();
	return trimmed === "" ? undefined : trimmed;
}

/** Every required field is always present; the empty optional address is dropped. */
export function buildCompanySection(values: CompanyFormValues): CompanySection {
	const address = optional(values.address);
	return {
		name: values.name.trim(),
		email: values.email.trim(),
		country: values.country.trim(),
		city: values.city.trim(),
		telephone: values.telephone.trim(),
		...(address === undefined ? {} : { address }),
	};
}

/** Every required field is always present; the empty optional title is dropped. */
export function buildContactSection(values: ContactFormValues): ContactSection {
	const title = optional(values.title);
	return {
		firstName: values.firstName.trim(),
		lastName: values.lastName.trim(),
		mobile: values.mobile.trim(),
		...(title === undefined ? {} : { title }),
	};
}

export function buildFormPayload(input: {
	company?: CompanyFormValues;
	contact?: ContactFormValues;
}): SaveOnboardingFormPayload {
	return {
		...(input.company ? { company: buildCompanySection(input.company) } : {}),
		...(input.contact ? { contact: buildContactSection(input.contact) } : {}),
	};
}
