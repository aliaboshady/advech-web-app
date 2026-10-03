export const REVIEW_REASON_MAX_LENGTH = 1000;

export type ReviewReasonIssue = "empty" | "tooLong";

/** Why a Review reason cannot be sent, after it is trimmed. */
export function reviewReasonIssue(reason: string): ReviewReasonIssue | null {
	const trimmed = reason.trim();
	if (trimmed.length === 0) {
		return "empty";
	}
	if (trimmed.length > REVIEW_REASON_MAX_LENGTH) {
		return "tooLong";
	}
	return null;
}
