import { describe, expect, it } from "vitest";
import { resolveOnboardingGate } from "./onboarding-gate";
import type { OnboardingState } from "./types";

function state(status: OnboardingState["status"]): OnboardingState {
	return {
		status,
		reviewReason: null,
		form: { complete: false, missingFields: [] },
		consent: {
			complete: false,
			currentVersion: "1.0",
			acceptedVersion: null,
			acceptedAt: null,
		},
	};
}

function loader(result: OnboardingState | null) {
	const calls = { count: 0 };
	return {
		calls,
		loadState: async () => {
			calls.count += 1;
			return result;
		},
	};
}

describe("resolveOnboardingGate", () => {
	it("sends an unapproved Advertiser from the product to Onboarding", async () => {
		const { loadState } = loader(state("PENDING_REVIEW"));
		const gate = await resolveOnboardingGate({
			actorType: "ADVERTISER",
			bypassAuth: false,
			area: "product",
			loadState,
		});
		expect(gate.decision).toBe("to-onboarding");
		expect(gate.onboarding?.status).toBe("PENDING_REVIEW");
	});

	it("sends an approved Advertiser from Onboarding to the product", async () => {
		const { loadState } = loader(state("APPROVED"));
		const gate = await resolveOnboardingGate({
			actorType: "ADVERTISER",
			bypassAuth: false,
			area: "onboarding",
			loadState,
		});
		expect(gate.decision).toBe("to-home");
	});

	it("treats the dev bypass Advertiser as approved without asking the server", async () => {
		const { calls, loadState } = loader(state("REGISTERED"));
		const product = await resolveOnboardingGate({
			actorType: "ADVERTISER",
			bypassAuth: true,
			area: "product",
			loadState,
		});
		const onboarding = await resolveOnboardingGate({
			actorType: "ADVERTISER",
			bypassAuth: true,
			area: "onboarding",
			loadState,
		});
		expect(product.decision).toBe("stay");
		expect(onboarding.decision).toBe("to-home");
		expect(calls.count).toBe(0);
	});

	it("does not gate an Admin", async () => {
		const { calls, loadState } = loader(state("REGISTERED"));
		const gate = await resolveOnboardingGate({
			actorType: "ADMIN",
			bypassAuth: false,
			area: "product",
			loadState,
		});
		expect(gate).toEqual({ decision: "stay", onboarding: null });
		expect(calls.count).toBe(0);
	});

	it("lets a product route through when the state could not be loaded", async () => {
		const { loadState } = loader(null);
		const gate = await resolveOnboardingGate({
			actorType: "ADVERTISER",
			bypassAuth: false,
			area: "product",
			loadState,
		});
		expect(gate).toEqual({ decision: "stay", onboarding: null });
	});

	it("keeps Onboarding on screen, without a state, when the load failed", async () => {
		const { loadState } = loader(null);
		const gate = await resolveOnboardingGate({
			actorType: "ADVERTISER",
			bypassAuth: false,
			area: "onboarding",
			loadState,
		});
		expect(gate).toEqual({ decision: "stay", onboarding: null });
	});
});
