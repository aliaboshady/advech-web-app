import { describe, expect, it } from "vitest";
import {
	decideGate,
	isFormLocked,
	ONBOARDING_HOME,
	onboardingViewFor,
} from "./onboarding-view";

describe("onboardingViewFor", () => {
	it("shows the form while the Advertiser is registering, in progress or asked for changes", () => {
		expect(onboardingViewFor("REGISTERED")).toBe("wizard");
		expect(onboardingViewFor("IN_PROGRESS")).toBe("wizard");
		expect(onboardingViewFor("NEEDS_CHANGES")).toBe("wizard");
	});

	it("shows a status screen for every locked status", () => {
		expect(onboardingViewFor("PENDING_REVIEW")).toBe("waiting");
		expect(onboardingViewFor("REJECTED")).toBe("rejected");
		expect(onboardingViewFor("SUSPENDED")).toBe("suspended");
	});

	it("has no Onboarding view once the Advertiser is approved", () => {
		expect(onboardingViewFor("APPROVED")).toBeNull();
	});
});

describe("isFormLocked", () => {
	it("keeps the form editable only for the three editable statuses", () => {
		expect(isFormLocked("REGISTERED")).toBe(false);
		expect(isFormLocked("IN_PROGRESS")).toBe(false);
		expect(isFormLocked("NEEDS_CHANGES")).toBe(false);
	});

	it("locks the form for every other status", () => {
		expect(isFormLocked("PENDING_REVIEW")).toBe(true);
		expect(isFormLocked("APPROVED")).toBe(true);
		expect(isFormLocked("REJECTED")).toBe(true);
		expect(isFormLocked("SUSPENDED")).toBe(true);
	});
});

describe("decideGate", () => {
	it("sends an unapproved Advertiser from a product route to Onboarding", () => {
		for (const status of [
			"REGISTERED",
			"IN_PROGRESS",
			"PENDING_REVIEW",
			"NEEDS_CHANGES",
			"REJECTED",
			"SUSPENDED",
		] as const) {
			expect(decideGate({ status, area: "product" })).toBe("to-onboarding");
		}
	});

	it("lets an approved Advertiser use product routes", () => {
		expect(decideGate({ status: "APPROVED", area: "product" })).toBe("stay");
	});

	it("sends an approved Advertiser away from Onboarding to the product", () => {
		expect(decideGate({ status: "APPROVED", area: "onboarding" })).toBe(
			"to-home",
		);
	});

	it("keeps an unapproved Advertiser on Onboarding", () => {
		expect(decideGate({ status: "PENDING_REVIEW", area: "onboarding" })).toBe(
			"stay",
		);
		expect(decideGate({ status: "SUSPENDED", area: "onboarding" })).toBe(
			"stay",
		);
	});

	it("names the one Onboarding URL", () => {
		expect(ONBOARDING_HOME).toBe("/onboarding");
	});
});
