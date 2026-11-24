import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { CampaignCreative } from "../types";

/** Lists every Creative on the Campaign, confirmed or not. */
export async function listCreatives(
	campaignId: string,
): Promise<BackendResponse<CampaignCreative[]>> {
	return apiClient<BackendResponse<CampaignCreative[]>>(
		`campaigns/${campaignId}/creatives`,
		{ method: "GET" },
	);
}
