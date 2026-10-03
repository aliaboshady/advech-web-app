import { describe, expect, it } from "vitest";
import { REVIEW_ACTIONS } from "./offered-review-actions";
import { reviewActionVariant } from "./review-action-style";

describe("reviewActionVariant", () => {
	it("weighs each Review action by risk", () => {
		const variants = Object.fromEntries(
			REVIEW_ACTIONS.map((action) => [action, reviewActionVariant(action)]),
		);
		expect(variants).toEqual({
			approve: "default",
			requestChanges: "outline",
			reject: "destructive",
			suspend: "destructive",
			unsuspend: "secondary",
		});
	});
});
