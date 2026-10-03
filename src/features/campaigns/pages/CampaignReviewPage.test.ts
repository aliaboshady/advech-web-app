import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Campaign } from "../types";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: { code?: string }) =>
			options?.code ? `${key} ${options.code}` : key,
		i18n: { language: "en" },
	}),
}));

vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({
		navigate: () => Promise.resolve(),
	}),
	Link: ({
		to,
		params,
		children,
		className,
	}: {
		to: string;
		params?: { id: string };
		children: ReactNode;
		className?: string;
	}) =>
		createElement(
			"a",
			{
				href: params?.id ? to.replace("$id", params.id) : to,
				className,
			},
			children,
		),
}));

const { CampaignReviewPage } = await import("./CampaignReviewPage");

function campaignWith(missing: string[]): Campaign {
	return {
		id: "camp-1",
		status: "DRAFT",
		name: "Ramadan brand push",
		objective: { id: "awareness", name: "Awareness" },
		flight: { startDate: "2026-10-01", endDate: "2026-10-31" },
		budget: {
			total: { amount: "1000", currency: "EGP" },
			daily: null,
		},
		targeting: {
			timeZone: { id: "Africa/Cairo", name: "Cairo" },
			dayparting: {
				days: [1, 2],
				startTime: "07:00",
				endTime: "10:00",
				schedulePresetCode: null,
				name: "School run",
			},
			age: { minAge: 18, maxAge: 35 },
			interests: [{ id: "food", name: "Food" }],
			venueTypes: [],
			zones: [
				{ id: "zone-1", name: "Downtown", role: "INCLUSION" },
				{ id: "zone-2", name: "Airport", role: "EXCLUSION" },
			],
			buy: { carsCount: 4, deliveryMode: "MOVING" },
		},
		creatives: [
			{
				id: "creative-1",
				originalFilename: "hero.png",
				contentType: "image/png",
				sizeBytes: 1200,
				width: 1920,
				height: 1080,
				durationMs: null,
				previewUrl: "https://cdn.example/hero.png",
				confirmedAt: "2026-10-01T00:00:00.000Z",
			},
		],
		completeness: {
			steps: { details: false, targeting: false, creative: true },
			missing,
		},
		createdAt: "2026-10-01T00:00:00.000Z",
		updatedAt: "2026-10-01T00:00:00.000Z",
	};
}

describe("CampaignReviewPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders missing requirements as links to the step that fixes them", () => {
		const html = renderToStaticMarkup(
			createElement(CampaignReviewPage, {
				id: "camp-1",
				campaign: campaignWith(["flight", "inclusionZone", "notARequirement"]),
			}),
		);
		expect(html).toContain("Ramadan brand push");
		expect(html).toContain("2026-10-01 – 2026-10-31");
		expect(html).toContain("Downtown");
		expect(html).toContain("Airport");
		expect(html).toContain("hero.png");
		expect(html).toContain('href="/campaigns/camp-1/identity"');
		expect(html).toContain("campaigns.review.missing.flight");
		expect(html).toContain('href="/campaigns/camp-1/targeting"');
		expect(html).toContain("campaigns.review.missing.inclusionZone");
		expect(html).toContain("campaigns.review.missingUnknown notARequirement");
		expect(html).not.toContain('href="/campaigns/camp-1/notARequirement"');
	});

	it("renders a disabled submit with a note when nothing is missing", () => {
		const html = renderToStaticMarkup(
			createElement(CampaignReviewPage, {
				id: "camp-1",
				campaign: campaignWith([]),
			}),
		);
		expect(html).toContain("disabled");
		expect(html).toContain("campaigns.review.submit");
		expect(html).toContain("campaigns.review.submitUnavailable");
		expect(html).not.toContain("campaigns.review.missingTitle");
	});
});
