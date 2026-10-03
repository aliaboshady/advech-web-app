import { CampaignStatus } from "./types";

const EDITABLE_CAMPAIGN_STATUSES: readonly CampaignStatus[] = [
	"DRAFT",
	"NEEDS_CHANGES",
];

/** A Campaign accepts edits only while it is a draft or has been returned for changes. */
export function isCampaignEditable(status: CampaignStatus): boolean {
	return EDITABLE_CAMPAIGN_STATUSES.includes(status);
}
