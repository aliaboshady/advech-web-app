import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Campaign, UpdateCampaignTargetingPayload } from "../types";

/** Saves the Targeting step, including inclusion and exclusion Zone ids. */
export const updateCampaignTargeting = async ({
	id,
	...payload
}: UpdateCampaignTargetingPayload): Promise<BackendResponse<Campaign>> => {
	const response = await apiClient<BackendResponse<Campaign>>(
		`campaigns/${id}/targeting`,
		{
			method: "PATCH",
			body: JSON.stringify(payload),
		},
	);
	return response;
};
