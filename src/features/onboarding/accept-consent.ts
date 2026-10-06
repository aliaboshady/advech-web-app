import type { BackendResponse, ErrorResponse } from "@/types";
import type { ConsentRecord, OnboardingState } from "./types";

type Deps = {
	accept: (version: string) => Promise<BackendResponse<ConsentRecord>>;
	fetchState: () => Promise<BackendResponse<OnboardingState>>;
};

export type ConsentOutcome =
	/** Accepted; `state` is the reloaded Onboarding state to route on. */
	| { kind: "accepted"; state: OnboardingState }
	/** The terms version moved on; `state` names the new `currentVersion`. */
	| { kind: "version-changed"; state: OnboardingState }
	/** The form is locked now; `state` holds the status that locked it. */
	| { kind: "locked"; state: OnboardingState }
	| { kind: "failed"; error: ErrorResponse };

const VERSION_MISMATCH = "ADVERTISER_TERMS_VERSION_MISMATCH";
const FORM_LOCKED = "ADVERTISER_FORM_LOCKED";

const FALLBACK_ERROR: ErrorResponse = {
	code: "INTERNAL_ERROR",
	message: "Could not load the Onboarding state",
};

/**
 * Accepts the given terms version, then reloads the Onboarding state.
 * The consent response is only the consent record: the status after the
 * server's auto-advance has to be read again before routing.
 */
export async function acceptCurrentTerms(
	version: string,
	deps: Deps,
): Promise<ConsentOutcome> {
	const accepted = await deps.accept(version);
	const code = accepted.error?.code;
	if (accepted.error && code !== VERSION_MISMATCH && code !== FORM_LOCKED) {
		return { kind: "failed", error: accepted.error };
	}
	const reloaded = await deps.fetchState();
	if (!reloaded.data) {
		return { kind: "failed", error: reloaded.error ?? FALLBACK_ERROR };
	}
	if (code === VERSION_MISMATCH) {
		return { kind: "version-changed", state: reloaded.data };
	}
	if (code === FORM_LOCKED) {
		return { kind: "locked", state: reloaded.data };
	}
	return { kind: "accepted", state: reloaded.data };
}
