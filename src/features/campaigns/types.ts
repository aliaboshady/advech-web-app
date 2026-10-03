export const CAMPAIGN_STATUSES = [
	"DRAFT",
	"PENDING_REVIEW",
	"NEEDS_CHANGES",
	"APPROVED",
	"SCHEDULED",
	"LIVE",
	"COMPLETED",
	"REJECTED",
	"PAUSED",
	"ARCHIVED",
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const CAMPAIGN_FILTER_STATUSES = [
	"campaigns.status.active",
	"campaigns.status.scheduled",
	"campaigns.status.paused",
	"campaigns.status.completed",
	"campaigns.status.cancelled",
] as const;

export type CampaignFilterStatus = (typeof CAMPAIGN_FILTER_STATUSES)[number];

export const campaignFilterStatuses = CAMPAIGN_FILTER_STATUSES.map(
	(status) => ({
		value: status,
		label: status,
	}),
);

export type Money = {
	amount: string;
	currency: string;
};

export type DeliveryMode = "MOVING" | "FIXED";

export type ZoneRole = "INCLUSION" | "EXCLUSION";

export type LookupRef = {
	id: string;
	name: string;
};

export type CampaignDayparting = {
	days: number[];
	startTime: string;
	endTime: string;
	schedulePresetCode: string | null;
	name: string | null;
};

export type CampaignZone = LookupRef & {
	role: ZoneRole;
};

export type CampaignTargeting = {
	timeZone: LookupRef | null;
	dayparting: CampaignDayparting | null;
	age: {
		minAge: number | null;
		maxAge: number | null;
	};
	interests: LookupRef[];
	venueTypes: LookupRef[];
	zones: CampaignZone[];
	buy: {
		carsCount: number | null;
		deliveryMode: DeliveryMode | null;
	};
};

export type CampaignCreative = {
	id: string;
	originalFilename: string;
	contentType: string;
	sizeBytes: number;
	width: number;
	height: number;
	durationMs: number | null;
	previewUrl: string | null;
	confirmedAt: string;
};

export type Campaign = {
	id: string;
	status: CampaignStatus;
	name: string;
	objective: LookupRef;
	flight: {
		startDate: string | null;
		endDate: string | null;
	} | null;
	budget: {
		total: Money | null;
		daily: Money | null;
	} | null;
	targeting: CampaignTargeting;
	creatives: CampaignCreative[];
	completeness: {
		steps: {
			details: boolean;
			targeting: boolean;
			creative: boolean;
		};
		missing: string[];
	};
	createdAt: string;
	updatedAt: string;
};

export type CreateCampaignPayload = {
	name: string;
	objectiveCode: string;
};

/** Fields of `PATCH /campaigns/:id/details`. Amount and currency travel together. */
export type CampaignDetailsPayload = {
	name?: string;
	objectiveCode?: string;
	startDate?: string;
	endDate?: string;
	totalBudget?: Money;
	dailyBudget?: Money;
};

export type EditCampaignPayload = CampaignDetailsPayload & {
	id: string;
};

/** A custom Dayparting window. Days are 1 to 7, Monday = 1. */
export type CustomDayparting = {
	days: number[];
	startTime: string;
	endTime: string;
};

/**
 * Fields of `PATCH /campaigns/:id/targeting`.
 * An absent list is left alone; an empty list clears it.
 * Zone ids are omitted here and attached on the Zones step.
 */
export type CampaignTargetingPayload = {
	timeZoneId?: string;
	schedulePresetCode?: string;
	dayparting?: CustomDayparting;
	daypartName?: string;
	minAge?: number;
	maxAge?: number;
	interestCodes?: string[];
	venueTypeCodes?: string[];
	carsCount?: number;
	deliveryMode?: DeliveryMode;
};

export type UpdateCampaignTargetingPayload = CampaignTargetingPayload & {
	id: string;
};
