/** What the Company details card edits. `countryCode` is the picker's id; only `country` (the name) is sent. */
export type CompanyFormValues = {
	name: string;
	email: string;
	country: string;
	countryCode: string;
	city: string;
	telephone: string;
	address: string;
};

/** What the Contact details card edits. */
export type ContactFormValues = {
	firstName: string;
	lastName: string;
	mobile: string;
	title: string;
};

export type OnboardingSection = "company" | "contact";

export type SectionValues = {
	company: CompanyFormValues;
	contact: ContactFormValues;
};

export const BLANK_COMPANY: CompanyFormValues = {
	name: "",
	email: "",
	country: "",
	countryCode: "",
	city: "",
	telephone: "",
	address: "",
};

export const BLANK_CONTACT: ContactFormValues = {
	firstName: "",
	lastName: "",
	mobile: "",
	title: "",
};

export const BLANK_SECTIONS: SectionValues = {
	company: BLANK_COMPANY,
	contact: BLANK_CONTACT,
};

/** Server limits, shared by validation and the inputs. */
export const LIMITS = {
	companyName: 200,
	place: 100,
	phone: 30,
	address: 500,
	personName: 100,
	title: 100,
} as const;
