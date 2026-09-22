import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Campaign, EditCampaignPayload } from "../types";

export const editCampaign = async ({
	id,
	...payload
}: EditCampaignPayload): Promise<BackendResponse<Campaign>> => {
	const res = await apiClient<BackendResponse<Campaign>>(
		`campaigns/${id}/details`,
		{
			method: "PATCH",
			body: JSON.stringify(payload),
		},
	);

	return res;
};
