import { Paginated, SortType } from "@/types";
import { AdvertiserSummary } from "./advertiser-summary";

export type AdvertiserQueueQuery = {
	readonly page: number;
	readonly limit: number;
	readonly search: string;
	readonly orderBy: string;
	readonly orderType: SortType;
};

function matchesSearch(advertiser: AdvertiserSummary, search: string): boolean {
	const needle = search.trim().toLocaleLowerCase();
	if (needle.length === 0) {
		return true;
	}
	const companyName = advertiser.companyName?.toLocaleLowerCase() ?? "";
	const ownerEmail = advertiser.ownerEmail?.toLocaleLowerCase() ?? "";
	return companyName.includes(needle) || ownerEmail.includes(needle);
}

function compareText(left: string | null, right: string | null): number {
	return (left ?? "").localeCompare(right ?? "", undefined, {
		sensitivity: "base",
	});
}

function compareCreatedAt(left: string, right: string): number {
	const leftTime = Date.parse(left);
	const rightTime = Date.parse(right);
	const leftValue = Number.isNaN(leftTime) ? 0 : leftTime;
	const rightValue = Number.isNaN(rightTime) ? 0 : rightTime;
	return leftValue - rightValue;
}

function compareAdvertisers(
	left: AdvertiserSummary,
	right: AdvertiserSummary,
	orderBy: string,
): number {
	if (orderBy === "companyName") {
		return compareText(left.companyName, right.companyName);
	}
	if (orderBy === "status") {
		return compareText(left.status, right.status);
	}
	if (orderBy === "createdAt") {
		return compareCreatedAt(left.createdAt, right.createdAt);
	}
	return 0;
}

/**
 * Pages, searches and sorts an Advertiser list in the browser.
 * The result matches the paginated shape the table already reads.
 */
export function pageAdvertiserQueue(
	advertisers: readonly AdvertiserSummary[],
	query: AdvertiserQueueQuery,
): Paginated<AdvertiserSummary> {
	const direction = query.orderType === "asc" ? 1 : -1;
	const matched = advertisers
		.filter((advertiser) => matchesSearch(advertiser, query.search))
		.sort(
			(left, right) =>
				direction * compareAdvertisers(left, right, query.orderBy),
		);
	const pageSize = query.limit;
	const totalItems = matched.length;
	const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 0;
	const start = (query.page - 1) * pageSize;
	const docs =
		pageSize > 0 && query.page >= 1
			? matched.slice(start, start + pageSize)
			: [];
	return {
		docs,
		limit: pageSize,
		totalItems,
		page: query.page,
		totalPages,
		hasPreviousPage: query.page > 1,
		hasNextPage: query.page < totalPages,
	};
}
