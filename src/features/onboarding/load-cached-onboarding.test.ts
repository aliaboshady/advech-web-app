import { beforeEach, describe, expect, it } from "vitest";
import {
	clearCachedOnboarding,
	loadCachedOnboarding,
	storeOnboarding,
} from "./load-cached-onboarding";
import type { OnboardingState } from "./types";

function state(status: OnboardingState["status"]): OnboardingState {
	return {
		status,
		reviewReason: null,
		form: { complete: false, missingFields: ["company.name"] },
		consent: {
			complete: false,
			currentVersion: "1.0",
			acceptedVersion: null,
			acceptedAt: null,
		},
	};
}

function counting(result: OnboardingState | null) {
	const calls = { count: 0 };
	const fetchOnboarding = async () => {
		calls.count += 1;
		return result;
	};
	return { calls, fetchOnboarding };
}

describe("loadCachedOnboarding", () => {
	beforeEach(() => {
		clearCachedOnboarding();
	});

	it("reuses the state while the access token is unchanged", async () => {
		const { calls, fetchOnboarding } = counting(state("IN_PROGRESS"));
		await loadCachedOnboarding("token-a", fetchOnboarding);
		const second = await loadCachedOnboarding("token-a", fetchOnboarding);
		expect(second).toEqual(state("IN_PROGRESS"));
		expect(calls.count).toBe(1);
	});

	it("fetches again after the cache is cleared", async () => {
		const { calls, fetchOnboarding } = counting(state("IN_PROGRESS"));
		await loadCachedOnboarding("token-a", fetchOnboarding);
		clearCachedOnboarding();
		await loadCachedOnboarding("token-a", fetchOnboarding);
		expect(calls.count).toBe(2);
	});

	it("fetches again when the access token changes", async () => {
		const { calls, fetchOnboarding } = counting(state("IN_PROGRESS"));
		await loadCachedOnboarding("token-a", fetchOnboarding);
		await loadCachedOnboarding("token-b", fetchOnboarding);
		expect(calls.count).toBe(2);
	});

	it("does not cache a failed load", async () => {
		const { calls, fetchOnboarding } = counting(null);
		expect(await loadCachedOnboarding("token-a", fetchOnboarding)).toBeNull();
		await loadCachedOnboarding("token-a", fetchOnboarding);
		expect(calls.count).toBe(2);
	});
});

describe("storeOnboarding", () => {
	beforeEach(() => {
		clearCachedOnboarding();
	});

	it("replaces the cached state after a save", async () => {
		const { calls, fetchOnboarding } = counting(state("IN_PROGRESS"));
		await loadCachedOnboarding("token-a", fetchOnboarding);
		storeOnboarding("token-a", state("PENDING_REVIEW"));
		const next = await loadCachedOnboarding("token-a", fetchOnboarding);
		expect(next?.status).toBe("PENDING_REVIEW");
		expect(calls.count).toBe(1);
	});
});
