import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Campaign, EditCampaignPayload } from "../types";

export const editCampaign = async ({
	id,
	...payload
}: EditCampaignPayload): Promise<ServerResponse<Campaign>> => {
	const res = await apiClient<ServerResponse<Campaign>>(
		`campaigns/${id}/details`,
		{
			method: "PATCH",
			body: JSON.stringify(payload),
		},
	);

	return res;
};
