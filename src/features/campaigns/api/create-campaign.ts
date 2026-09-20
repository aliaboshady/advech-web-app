import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Campaign, CreateCampaignPayload } from "../types";

export const createCampaign = async (
	payload: CreateCampaignPayload,
): Promise<ServerResponse<Campaign>> => {
	const res = await apiClient<ServerResponse<Campaign>>("campaigns", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	return res;
};
