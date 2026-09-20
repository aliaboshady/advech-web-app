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
	name: string;
	status: string;
	budget: number;
	impressions: number;
	fromDate: string;
	toDate: string;
};

export type CreateCampaignPayload = {
	name: string;
	objectiveCode: string;
};
