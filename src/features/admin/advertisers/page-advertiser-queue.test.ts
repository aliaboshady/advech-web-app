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
		expect(page.docs.map((advertiser) => advertiser.id)).toEqual(["adv-acme"]);
		expect(page.totalItems).toBe(1);
	});

	it("finds an Advertiser by owner email", () => {
		const page = pageAdvertiserQueue([beta, acme], {
			...baseQuery,
			search: "hello@beta",
		});
		expect(page.docs.map((advertiser) => advertiser.id)).toEqual(["adv-beta"]);
	});

	it("does not match country or city", () => {
		const page = pageAdvertiserQueue([beta, acme], {
			...baseQuery,
			search: "Cairo",
		});
		expect(page.docs).toEqual([]);
		expect(page.totalItems).toBe(0);
	});

	it("sorts by created date so the oldest request can come first", () => {
		const page = pageAdvertiserQueue([acme, blank, beta], {
			...baseQuery,
			orderBy: "createdAt",
			orderType: "asc",
		});
		expect(page.docs.map((advertiser) => advertiser.id)).toEqual([
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
		expect(page.docs.map((advertiser) => advertiser.id)).toEqual([
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
		expect(page.docs.map((advertiser) => advertiser.id)).toEqual([
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
		expect(page.docs.map((advertiser) => advertiser.id)).toEqual(["adv-acme"]);
		expect(page).toMatchObject({
			page: 2,
			limit: 1,
			totalItems: 3,
			totalPages: 3,
			hasPreviousPage: true,
			hasNextPage: true,
		});
	});

	it("returns an empty page when nothing matches", () => {
		const page = pageAdvertiserQueue([acme, beta], {
			...baseQuery,
			search: "missing-company",
		});
		expect(page).toEqual({
			docs: [],
			limit: 10,
			totalItems: 0,
			page: 1,
			totalPages: 0,
			hasPreviousPage: false,
			hasNextPage: false,
		});
	});

	it("returns no rows when the page is past the end", () => {
		const page = pageAdvertiserQueue([acme, beta], {
			...baseQuery,
			page: 4,
			limit: 1,
		});
		expect(page.docs).toEqual([]);
		expect(page).toMatchObject({
			page: 4,
			totalItems: 2,
			totalPages: 2,
			hasPreviousPage: true,
			hasNextPage: false,
		});
	});
});
