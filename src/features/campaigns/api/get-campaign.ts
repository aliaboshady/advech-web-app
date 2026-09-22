import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Campaign } from "../types";

export const getCampaign = async (
	id: string,
): Promise<BackendResponse<Campaign>> => {
	const res = await apiClient<BackendResponse<Campaign>>(`campaigns/${id}`, {
		method: "GET",
	});

	return res;
};
