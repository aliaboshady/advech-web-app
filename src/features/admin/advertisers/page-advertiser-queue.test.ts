import { describe, expect, it } from "vitest";
import { AdvertiserSummary } from "./advertiser-summary";
import { pageAdvertiserQueue } from "./page-advertiser-queue";

const acme: AdvertiserSummary = {
	id: "adv-acme",
	status: "PENDING_REVIEW",
	companyName: "Acme Media",
	country: "EG",
	city: "Cairo",
	ownerEmail: "owner@acme.test",
	reviewReason: null,
	createdAt: "2026-03-02T00:00:00.000Z",
};

const blank: AdvertiserSummary = {
	id: "adv-blank",
	status: "SUSPENDED",
	companyName: null,
	country: null,
	city: null,
	ownerEmail: null,
	reviewReason: null,
	createdAt: "2026-06-01T00:00:00.000Z",
};

const beta: AdvertiserSummary = {
	id: "adv-beta",
	status: "APPROVED",
	companyName: "Beta Ads",
	country: "EG",
	city: "Giza",
	ownerEmail: "hello@beta.test",
	reviewReason: null,
	createdAt: "2026-01-15T00:00:00.000Z",
};

const baseQuery = {
	page: 1,
	limit: 10,
	search: "",
	orderBy: "createdAt",
	orderType: "desc" as const,
};

describe("pageAdvertiserQueue", () => {
	it("finds an Advertiser by company name, ignoring case and surrounding spaces", () => {
		const page = pageAdvertiserQueue([beta, acme], {
			...baseQuery,
			search: "  aCmE  ",
		});
		expect(page.data.map((advertiser) => advertiser.id)).toEqual(["adv-acme"]);
		expect(page.meta.total).toBe(1);
	});

	it("finds an Advertiser by owner email", () => {
		const page = pageAdvertiserQueue([beta, acme], {
			...baseQuery,
			search: "hello@beta",
		});
		expect(page.data.map((advertiser) => advertiser.id)).toEqual(["adv-beta"]);
	});

	it("does not match country or city", () => {
		const page = pageAdvertiserQueue([beta, acme], {
			...baseQuery,
			search: "Cairo",
		});
		expect(page.data).toEqual([]);
		expect(page.meta.total).toBe(0);
	});

	it("sorts by created date so the oldest request can come first", () => {
		const page = pageAdvertiserQueue([acme, blank, beta], {
			...baseQuery,
			orderBy: "createdAt",
			orderType: "asc",
		});
		expect(page.data.map((advertiser) => advertiser.id)).toEqual([
			"adv-beta",
			"adv-acme",
			"adv-blank",
		]);
	});

	it("sorts by company name, with a missing name last when descending", () => {
		const page = pageAdvertiserQueue([acme, blank, beta], {
			...baseQuery,
			orderBy: "companyName",
			orderType: "desc",
		});
		expect(page.data.map((advertiser) => advertiser.id)).toEqual([
			"adv-beta",
			"adv-acme",
			"adv-blank",
		]);
	});

	it("sorts by status", () => {
		const page = pageAdvertiserQueue([acme, blank, beta], {
			...baseQuery,
			orderBy: "status",
			orderType: "asc",
		});
		expect(page.data.map((advertiser) => advertiser.id)).toEqual([
			"adv-beta",
			"adv-acme",
			"adv-blank",
		]);
	});

	it("returns one page of a longer list", () => {
		const page = pageAdvertiserQueue([acme, blank, beta], {
			...baseQuery,
			page: 2,
			limit: 1,
			orderBy: "createdAt",
			orderType: "asc",
		});
		expect(page.data.map((advertiser) => advertiser.id)).toEqual(["adv-acme"]);
		expect(page.meta).toEqual({
			page: 2,
			limit: 1,
			total: 3,
			totalPages: 3,
		});
	});

	it("returns an empty page when nothing matches", () => {
		const page = pageAdvertiserQueue([acme, beta], {
			...baseQuery,
			search: "missing-company",
		});
		expect(page).toEqual({
			data: [],
			meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
		});
	});

	it("returns no rows when the page is past the end", () => {
		const page = pageAdvertiserQueue([acme, beta], {
			...baseQuery,
			page: 4,
			limit: 1,
		});
		expect(page.data).toEqual([]);
		expect(page.meta).toMatchObject({
			page: 4,
			total: 2,
			totalPages: 2,
		});
	});
});
