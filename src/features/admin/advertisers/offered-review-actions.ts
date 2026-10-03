import { AdvertiserStatus } from "./advertiser-summary";

export const REVIEW_ACTIONS = [
	"approve",
	"reject",
	"requestChanges",
	"suspend",
	"unsuspend",
] as const;

export type ReviewAction = (typeof REVIEW_ACTIONS)[number];

/** What the Admin must do before the action is sent. */
export type ReviewActionPrompt =
	| "immediate"
	| "reason"
	| "finalRejection"
	| "signOut";

export type OfferedReviewAction = {
	readonly action: ReviewAction;
	readonly prompt: ReviewActionPrompt;
};

/** Actions an Admin may take for an Advertiser in this status. */
export function offeredReviewActions(
	status: AdvertiserStatus,
): readonly OfferedReviewAction[] {
	if (status === "PENDING_REVIEW") {
		return [
			{ action: "approve", prompt: "immediate" },
			{ action: "reject", prompt: "finalRejection" },
			{ action: "requestChanges", prompt: "reason" },
		];
	}
	if (status === "APPROVED") {
		return [{ action: "suspend", prompt: "signOut" }];
	}
	if (status === "SUSPENDED") {
		return [{ action: "unsuspend", prompt: "immediate" }];
	}
	return [];
}
