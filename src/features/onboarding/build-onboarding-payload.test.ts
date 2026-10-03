import { describe, expect, it } from "vitest";
import {
	buildCompanySection,
	buildContactSection,
	buildFormPayload,
} from "./build-onboarding-payload";

const company = {
	name: "  Acme Media Ltd ",
	email: " info@acme.com ",
	country: "Egypt",
	countryCode: "EG",
	city: "Cairo",
	telephone: " +20 22 123 4567 ",
	address: " 12 Tahrir Square, Downtown ",
};

const contact = {
	firstName: " Jane ",
	lastName: "Doe",
	mobile: " +201001234567 ",
	title: " Marketing Manager ",
};

describe("buildCompanySection", () => {
	it("sends the names for country and city, trimmed, and never the picker id", () => {
		expect(buildCompanySection(company)).toEqual({
			name: "Acme Media Ltd",
			email: "info@acme.com",
			country: "Egypt",
			city: "Cairo",
			telephone: "+20 22 123 4567",
			address: "12 Tahrir Square, Downtown",
		});
	});

	it("omits an empty optional address but keeps every required field", () => {
		const section = buildCompanySection({ ...company, address: "   " });
		expect(section).not.toHaveProperty("address");
		expect(Object.keys(section).sort()).toEqual(
			["city", "country", "email", "name", "telephone"].sort(),
		);
	});
});

describe("buildContactSection", () => {
	it("trims the values", () => {
		expect(buildContactSection(contact)).toEqual({
			firstName: "Jane",
			lastName: "Doe",
			mobile: "+201001234567",
			title: "Marketing Manager",
		});
	});

	it("omits an empty title but keeps the required fields", () => {
		const section = buildContactSection({ ...contact, title: "" });
		expect(section).not.toHaveProperty("title");
		expect(Object.keys(section).sort()).toEqual(
			["firstName", "lastName", "mobile"].sort(),
		);
	});
});

describe("buildFormPayload", () => {
	it("sends only the section that was given", () => {
		expect(Object.keys(buildFormPayload({ company }))).toEqual(["company"]);
		expect(Object.keys(buildFormPayload({ contact }))).toEqual(["contact"]);
	});

	it("can send both sections together", () => {
		expect(Object.keys(buildFormPayload({ company, contact })).sort()).toEqual([
			"company",
			"contact",
		]);
	});
});
