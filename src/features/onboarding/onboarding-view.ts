import type { AdvertiserStatus } from "@/features/admin/advertisers/advertiser-summary";

export const ONBOARDING_HOME = "/onboarding";

/** What `/onboarding` shows. One URL; the status picks the view. */
export type OnboardingView = "wizard" | "waiting" | "rejected" | "suspended";

const VIEWS: Record<AdvertiserStatus, OnboardingView | null> = {
	REGISTERED: "wizard",
	IN_PROGRESS: "wizard",
	NEEDS_CHANGES: "wizard",
	PENDING_REVIEW: "waiting",
	REJECTED: "rejected",
	SUSPENDED: "suspended",
	APPROVED: null,
};

/** The Onboarding view for a status, or null once the Advertiser is approved. */
export function onboardingViewFor(
	status: AdvertiserStatus,
): OnboardingView | null {
	return VIEWS[status];
}

/** The form is editable only while the view is the wizard. */
export function isFormLocked(status: AdvertiserStatus): boolean {
	return VIEWS[status] !== "wizard";
}

export type GateArea = "product" | "onboarding";
export type GateDecision = "stay" | "to-onboarding" | "to-home";

/**
 * Where an Advertiser belongs for a route area.
 * Only an approved Advertiser may use the product; only an unapproved one
 * has anything to do on Onboarding.
 */
export function decideGate(input: {
	readonly status: AdvertiserStatus;
	readonly area: GateArea;
}): GateDecision {
	const approved = input.status === "APPROVED";
	if (input.area === "product") {
		return approved ? "stay" : "to-onboarding";
	}
	return approved ? "to-home" : "stay";
}
