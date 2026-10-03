import { ReviewAction } from "./offered-review-actions";

export type ReviewActionVariant =
	| "default"
	| "outline"
	| "secondary"
	| "destructive";

/** Approve is the one primary action. Reject and suspend are destructive so they never look routine. */
export function reviewActionVariant(action: ReviewAction): ReviewActionVariant {
	switch (action) {
		case "approve":
			return "default";
		case "requestChanges":
			return "outline";
		case "unsuspend":
			return "secondary";
		case "reject":
		case "suspend":
			return "destructive";
	}
}
