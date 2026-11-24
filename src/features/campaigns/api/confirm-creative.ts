import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { CampaignCreative, ConfirmCreativePayload } from "../types";

export const confirmCreative = async ({
	campaignId,
	creativeId,
	...payload
}: ConfirmCreativePayload): Promise<BackendResponse<CampaignCreative>> => {
	const res = await apiClient<BackendResponse<CampaignCreative>>(
		`campaigns/${campaignId}/creatives/${creativeId}/confirm`,
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
	);

	return res;
};
