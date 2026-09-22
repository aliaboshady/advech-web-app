import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Campaign, CreateCampaignPayload } from "../types";

export const createCampaign = async (
	payload: CreateCampaignPayload,
): Promise<BackendResponse<Campaign>> => {
	const res = await apiClient<BackendResponse<Campaign>>("campaigns", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	return res;
};
