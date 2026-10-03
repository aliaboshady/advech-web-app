export const ADVERTISER_STATUSES = [
	"REGISTERED",
	"IN_PROGRESS",
	"PENDING_REVIEW",
	"NEEDS_CHANGES",
	"APPROVED",
	"REJECTED",
	"SUSPENDED",
] as const;

export type AdvertiserStatus = (typeof ADVERTISER_STATUSES)[number];

/** One row of the admin Advertiser list. */
export type AdvertiserSummary = {
	readonly id: string;
	readonly status: AdvertiserStatus;
	readonly companyName: string | null;
	readonly country: string | null;
	readonly city: string | null;
	readonly ownerEmail: string | null;
	readonly reviewReason: string | null;
	readonly createdAt: string;
};

export const ADVERTISER_QUEUE_ALL = "ALL";

/** Status sent to the list, or every status when the filter is widened. */
export type AdvertiserQueueStatusFilter =
	| AdvertiserStatus
	| typeof ADVERTISER_QUEUE_ALL;

export const DEFAULT_ADVERTISER_QUEUE_STATUS: AdvertiserQueueStatusFilter =
	"PENDING_REVIEW";
