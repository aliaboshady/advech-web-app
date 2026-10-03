import { describe, expect, it } from "vitest";
import { isFormLocked, isNotApproved } from "./onboarding-errors";

describe("isNotApproved", () => {
	it("recognises the not-approved code, whichever module sent it", () => {
		expect(isNotApproved({ code: "ADVERTISER_NOT_APPROVED" })).toBe(true);
	});

	it("does not take other refusals for it", () => {
		expect(isNotApproved({ code: "PERMISSION_DENIED" })).toBe(false);
		expect(isNotApproved({ code: "ADVERTISER_FORM_LOCKED" })).toBe(false);
	});
});

describe("isFormLocked", () => {
	it("recognises the form-locked code", () => {
		expect(isFormLocked({ code: "ADVERTISER_FORM_LOCKED" })).toBe(true);
	});

	it("does not take other refusals for it", () => {
		expect(isFormLocked({ code: "ADVERTISER_NOT_APPROVED" })).toBe(false);
	});
});
