import { describe, expect, it } from "vitest";
import { buildCampaignReviewGaps } from "./review-gaps";

describe("buildCampaignReviewGaps", () => {
	it("links a missing Flight to the Identity step", () => {
		const gaps = buildCampaignReviewGaps({
			campaignId: "camp-1",
			missing: ["flight"],
		});
		expect(gaps.missing).toEqual([
			{
				code: "flight",
				labelKey: "campaigns.review.missing.flight",
				step: "identity",
				href: "/campaigns/camp-1/identity",
			},
		]);
	});

	it.each([
		[
			"name",
			"identity",
			"/campaigns/camp-1/identity",
			"campaigns.review.missing.name",
		],
		[
			"objective",
			"identity",
			"/campaigns/camp-1/identity",
			"campaigns.review.missing.objective",
		],
		[
			"totalBudget",
			"identity",
			"/campaigns/camp-1/identity",
			"campaigns.review.missing.totalBudget",
		],
		[
			"timeZone",
			"targeting",
			"/campaigns/camp-1/targeting",
			"campaigns.review.missing.timeZone",
		],
		[
			"dayparting",
			"targeting",
			"/campaigns/camp-1/targeting",
			"campaigns.review.missing.dayparting",
		],
		[
			"inclusionZone",
			"targeting",
			"/campaigns/camp-1/targeting",
			"campaigns.review.missing.inclusionZone",
		],
		[
			"creative",
			"creative",
			"/campaigns/camp-1/creative",
			"campaigns.review.missing.creative",
		],
		[
			"singleCreative",
			"creative",
			"/campaigns/camp-1/creative",
			"campaigns.review.missing.singleCreative",
		],
	] as const)("links %s to %s", (code, step, href, labelKey) => {
		const gaps = buildCampaignReviewGaps({
			campaignId: "camp-1",
			missing: [code],
		});
		expect(gaps.missing).toEqual([{ code, labelKey, step, href }]);
	});

	it("lists an unknown gap without inventing a step", () => {
		const gaps = buildCampaignReviewGaps({
			campaignId: "camp-1",
			missing: ["notARequirement"],
		});
		expect(gaps.missing).toEqual([
			{
				code: "notARequirement",
				labelKey: null,
				step: null,
				href: null,
			},
		]);
	});

	it("keeps submit disabled when nothing is missing", () => {
		const gaps = buildCampaignReviewGaps({
			campaignId: "camp-1",
			missing: [],
		});
		expect(gaps.missing).toEqual([]);
		expect(gaps.submit.isDisabled).toBe(true);
	});
});
