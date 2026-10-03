import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Campaign, UpdateCampaignTargetingPayload } from "../types";

/** Saves the Targeting step, including inclusion and exclusion Zone ids. */
export const updateCampaignTargeting = async ({
	id,
	...payload
}: UpdateCampaignTargetingPayload): Promise<ServerResponse<Campaign>> => {
	const response = await apiClient<ServerResponse<Campaign>>(
		`campaigns/${id}/targeting`,
		{
			method: "PATCH",
			body: JSON.stringify(payload),
		},
	);
	return response;
};
