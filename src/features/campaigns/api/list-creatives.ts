import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { CampaignCreative } from "../types";

/** Lists every Creative on the Campaign, confirmed or not. */
export async function listCreatives(
	campaignId: string,
): Promise<ServerResponse<CampaignCreative[]>> {
	return apiClient<ServerResponse<CampaignCreative[]>>(
		`campaigns/${campaignId}/creatives`,
		{ method: "GET" },
	);
}
