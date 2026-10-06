import { describe, expect, it } from "vitest";
import type { BackendResponse } from "@/types";
import { acceptCurrentTerms } from "./accept-consent";
import type { ConsentRecord, OnboardingState } from "./types";

function state(
	status: OnboardingState["status"],
	currentVersion = "1.0",
): OnboardingState {
	return {
		status,
		reviewReason: null,
		form: { complete: true, missingFields: [] },
		consent: {
			complete: status === "PENDING_REVIEW",
			currentVersion,
			acceptedVersion: status === "PENDING_REVIEW" ? currentVersion : null,
			acceptedAt: null,
		},
	};
}

const record: ConsentRecord = {
	agreementVersion: "1.0",
	consentedAt: "2026-08-02T12:00:00.000Z",
};

function deps(input: {
	accept: BackendResponse<ConsentRecord>;
	fetch: BackendResponse<OnboardingState>;
}) {
	const calls: string[] = [];
	return {
		calls,
		deps: {
			accept: async (version: string) => {
				calls.push(`accept:${version}`);
				return input.accept;
			},
			fetchState: async () => {
				calls.push("fetch");
				return input.fetch;
			},
		},
	};
}

describe("acceptCurrentTerms", () => {
	it("sends the version it is given, then reloads the state", async () => {
		const { calls, deps: d } = deps({
			accept: { success: true, data: record },
			fetch: { success: true, data: state("PENDING_REVIEW") },
		});
		const outcome = await acceptCurrentTerms("1.0", d);
		expect(calls).toEqual(["accept:1.0", "fetch"]);
		expect(outcome).toEqual({
			kind: "accepted",
			state: state("PENDING_REVIEW"),
		});
	});

	it("reports the status the server reached, so the form-complete case lands on waiting", async () => {
		const { deps: d } = deps({
			accept: { success: true, data: record },
			fetch: { success: true, data: state("PENDING_REVIEW") },
		});
		const outcome = await acceptCurrentTerms("1.0", d);
		expect(outcome.kind === "accepted" && outcome.state.status).toBe(
			"PENDING_REVIEW",
		);
	});

	it("reloads the state and offers the new version after a version mismatch", async () => {
		const { calls, deps: d } = deps({
			accept: {
				success: false,
				error: {
					code: "ADVERTISER_TERMS_VERSION_MISMATCH",
					message: "mismatch",
				},
			},
			fetch: { success: true, data: state("IN_PROGRESS", "2.0") },
		});
		const outcome = await acceptCurrentTerms("1.0", d);
		expect(calls).toEqual(["accept:1.0", "fetch"]);
		expect(outcome).toEqual({
			kind: "version-changed",
			state: state("IN_PROGRESS", "2.0"),
		});
	});

	it("reloads the state when the form turned out to be locked", async () => {
		const { deps: d } = deps({
			accept: {
				success: false,
				error: { code: "ADVERTISER_FORM_LOCKED", message: "locked" },
			},
			fetch: { success: true, data: state("PENDING_REVIEW") },
		});
		const outcome = await acceptCurrentTerms("1.0", d);
		expect(outcome.kind).toBe("locked");
	});

	it("passes any other server error through and does not reload", async () => {
		const { calls, deps: d } = deps({
			accept: {
				success: false,
				error: { code: "TOO_MANY_REQUESTS", message: "slow down" },
			},
			fetch: { success: true, data: state("IN_PROGRESS") },
		});
		const outcome = await acceptCurrentTerms("1.0", d);
		expect(calls).toEqual(["accept:1.0"]);
		expect(outcome).toEqual({
			kind: "failed",
			error: { code: "TOO_MANY_REQUESTS", message: "slow down" },
		});
	});

	it("fails when Consent was recorded but the state could not be reloaded", async () => {
		const { deps: d } = deps({
			accept: { success: true, data: record },
			fetch: {
				success: false,
				error: { code: "INTERNAL_ERROR", message: "boom" },
			},
		});
		const outcome = await acceptCurrentTerms("1.0", d);
		expect(outcome.kind).toBe("failed");
	});
});
