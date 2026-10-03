import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { CampaignCreative, ConfirmCreativePayload } from "../types";

export const confirmCreative = async ({
	campaignId,
	creativeId,
	...payload
}: ConfirmCreativePayload): Promise<ServerResponse<CampaignCreative>> => {
	const res = await apiClient<ServerResponse<CampaignCreative>>(
		`campaigns/${campaignId}/creatives/${creativeId}/confirm`,
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
	);

	return res;
};
