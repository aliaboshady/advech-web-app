import { describe, expect, it } from "vitest";
import { ADVERTISER_STATUSES } from "@/features/admin/advertisers/advertiser-summary";
import { CAMPAIGN_STATUSES } from "@/features/campaigns/types";
import ar from "@/i18n/locales/ar.json";
import en from "@/i18n/locales/en.json";
import { statusVisual } from "./status-visual";

function lookup(messages: unknown, key: string): unknown {
	return key
		.split(".")
		.reduce<unknown>(
			(node, part) => (node as Record<string, unknown> | undefined)?.[part],
			messages,
		);
}

describe("statusVisual", () => {
	it("maps Advertiser statuses to the agreed token and tone", () => {
		const expected = {
			REGISTERED: ["neutral", "soft"],
			IN_PROGRESS: ["warning", "soft"],
			PENDING_REVIEW: ["info", "soft"],
			NEEDS_CHANGES: ["warning", "soft"],
			APPROVED: ["success", "soft"],
			REJECTED: ["destructive", "filled"],
			SUSPENDED: ["destructive", "soft"],
		} as const;
		for (const status of ADVERTISER_STATUSES) {
			const { token, tone } = statusVisual("advertiser", status);
			expect([token, tone]).toEqual(expected[status]);
		}
	});

	it("maps Campaign statuses to the agreed token and tone", () => {
		const expected = {
			DRAFT: ["neutral", "soft"],
			PENDING_REVIEW: ["info", "soft"],
			NEEDS_CHANGES: ["warning", "soft"],
			APPROVED: ["success", "soft"],
			SCHEDULED: ["info", "soft"],
			LIVE: ["success", "filled"],
			COMPLETED: ["neutral", "soft"],
			REJECTED: ["destructive", "filled"],
			PAUSED: ["warning", "soft"],
			ARCHIVED: ["neutral", "soft"],
		} as const;
		for (const status of CAMPAIGN_STATUSES) {
			const { token, tone } = statusVisual("campaign", status);
			expect([token, tone]).toEqual(expected[status]);
		}
	});

	it("uses the same visual where Advertiser and Campaign status names overlap", () => {
		for (const status of ADVERTISER_STATUSES) {
			if (!(CAMPAIGN_STATUSES as readonly string[]).includes(status)) continue;
			const advertiser = statusVisual("advertiser", status);
			const campaign = statusVisual("campaign", status as never);
			expect([campaign.token, campaign.tone, campaign.icon]).toEqual([
				advertiser.token,
				advertiser.tone,
				advertiser.icon,
			]);
		}
	});

	it("has a label key in English and Arabic for every status", () => {
		const all = [
			...ADVERTISER_STATUSES.map((s) => statusVisual("advertiser", s)),
			...CAMPAIGN_STATUSES.map((s) => statusVisual("campaign", s)),
		];
		for (const { labelKey } of all) {
			expect(typeof lookup(en, labelKey), labelKey).toBe("string");
			expect(typeof lookup(ar, labelKey), labelKey).toBe("string");
		}
	});

	it("gives a final REJECTED a filled look and a recoverable SUSPENDED a soft one", () => {
		expect(statusVisual("advertiser", "REJECTED").tone).toBe("filled");
		expect(statusVisual("advertiser", "SUSPENDED").tone).toBe("soft");
	});
});
