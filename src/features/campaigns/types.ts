export const CAMPAIGN_STATUSES = [
	"campaigns.status.active",
	"campaigns.status.scheduled",
	"campaigns.status.paused",
	"campaigns.status.completed",
	"campaigns.status.cancelled",
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const campaignStatuses = CAMPAIGN_STATUSES.map((s) => ({
	value: s,
	label: s,
}));

export type Campaign = {
	id: string;
	status:
		| "DRAFT"
		| "PENDING_REVIEW"
		| "NEEDS_CHANGES"
		| "APPROVED"
		| "SCHEDULED"
		| "LIVE"
		| "COMPLETED"
		| "REJECTED"
		| "PAUSED"
		| "ARCHIVED";
	name: string;
	objective: {
		id: string;
		name: string;
	};
	flight: {
		startDate: string;
		endDate: string;
	};
	budget: {
		total: {
			amount: string;
			currency: string;
		};
		daily: {
			amount: string;
			currency: string;
		};
	};
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

export type EditCampaignPayload = {
	id: string;
	name?: string;
	objectiveCode?: string;
	startDate?: string;
	endDate?: string;
	totalBudget?: {
		amount?: string;
		currency?: string;
	};
	dailyBudget?: {
		amount?: string;
		currency?: string;
	};
};
