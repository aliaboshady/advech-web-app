import {
	decideGate,
	type GateArea,
	type GateDecision,
} from "./onboarding-view";
import type { OnboardingState } from "./types";

export type OnboardingGate = {
	readonly decision: GateDecision;
	/** The state the decision was made on; null when none applied or it failed to load. */
	readonly onboarding: OnboardingState | null;
};

type GateInput = {
	readonly actorType: "DRIVER" | "ADMIN" | "ADVERTISER";
	/** Dev auth bypass: the mock Advertiser counts as approved. */
	readonly bypassAuth: boolean;
	readonly area: GateArea;
	readonly loadState: () => Promise<OnboardingState | null>;
};

/**
 * Decides whether this actor may stay on a route area.
 * Only Advertisers are gated. A state that cannot be loaded never blocks the
 * route: the page copes, or a product call answers `ADVERTISER_NOT_APPROVED`.
 */
export async function resolveOnboardingGate(
	input: GateInput,
): Promise<OnboardingGate> {
	if (input.actorType !== "ADVERTISER") {
		return { decision: "stay", onboarding: null };
	}
	if (input.bypassAuth) {
		return {
			decision: decideGate({ status: "APPROVED", area: input.area }),
			onboarding: null,
		};
	}
	const onboarding = await input.loadState();
	if (onboarding === null) {
		return { decision: "stay", onboarding: null };
	}
	return {
		decision: decideGate({ status: onboarding.status, area: input.area }),
		onboarding,
	};
}
