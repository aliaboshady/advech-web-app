import { describe, expect, it } from "vitest";
import { sectionCompleteness } from "./form-sections";

describe("sectionCompleteness", () => {
	it("marks both sections complete when nothing is missing", () => {
		expect(sectionCompleteness([])).toEqual({
			company: { complete: true, missing: [] },
			contact: { complete: true, missing: [] },
		});
	});

	it("splits the missing fields by section", () => {
		expect(
			sectionCompleteness(["company.telephone", "contact.mobile"]),
		).toEqual({
			company: { complete: false, missing: ["company.telephone"] },
			contact: { complete: false, missing: ["contact.mobile"] },
		});
	});

	it("keeps one section complete while the other is not", () => {
		const sections = sectionCompleteness([
			"contact.firstName",
			"contact.lastName",
			"contact.mobile",
		]);
		expect(sections.company.complete).toBe(true);
		expect(sections.contact.complete).toBe(false);
		expect(sections.contact.missing).toHaveLength(3);
	});

	it("ignores names it does not know", () => {
		expect(sectionCompleteness(["billing.iban"]).company.complete).toBe(true);
		expect(sectionCompleteness(["billing.iban"]).contact.complete).toBe(true);
	});
});
