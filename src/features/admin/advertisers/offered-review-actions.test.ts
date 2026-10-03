import { describe, expect, it } from "vitest";
import { offeredReviewActions } from "./offered-review-actions";

describe("offeredReviewActions", () => {
	it("offers approve, reject and request changes for an Advertiser awaiting Review", () => {
		expect(offeredReviewActions("PENDING_REVIEW")).toEqual([
			{ action: "approve", prompt: "immediate" },
			{ action: "reject", prompt: "finalRejection" },
			{ action: "requestChanges", prompt: "reason" },
		]);
	});

	it("offers suspend, with a confirm that it signs Users out, for an approved Advertiser", () => {
		expect(offeredReviewActions("APPROVED")).toEqual([
			{ action: "suspend", prompt: "signOut" },
		]);
	});

	it("offers unsuspend immediately for a suspended Advertiser", () => {
		expect(offeredReviewActions("SUSPENDED")).toEqual([
			{ action: "unsuspend", prompt: "immediate" },
		]);
	});

	it("offers no Review action for a status that is not awaiting Review, approved, or suspended", () => {
		expect(offeredReviewActions("REGISTERED")).toEqual([]);
		expect(offeredReviewActions("IN_PROGRESS")).toEqual([]);
		expect(offeredReviewActions("NEEDS_CHANGES")).toEqual([]);
		expect(offeredReviewActions("REJECTED")).toEqual([]);
	});
});
