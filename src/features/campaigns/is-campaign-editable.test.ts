import { describe, expect, it } from "vitest";
import { isCampaignEditable } from "./is-campaign-editable";

describe("isCampaignEditable", () => {
	it("allows edits while the Campaign is a draft", () => {
		expect(isCampaignEditable("DRAFT")).toBe(true);
	});

	it("allows edits when the Campaign has been returned for changes", () => {
		expect(isCampaignEditable("NEEDS_CHANGES")).toBe(true);
	});

	it.each([
		"PENDING_REVIEW",
		"APPROVED",
		"SCHEDULED",
		"LIVE",
		"COMPLETED",
		"REJECTED",
		"PAUSED",
		"ARCHIVED",
	] as const)("is read-only when the status is %s", (status) => {
		expect(isCampaignEditable(status)).toBe(false);
	});
});
