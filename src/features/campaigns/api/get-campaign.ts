import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Campaign } from "../types";

export const getCampaign = async (
	id: string,
): Promise<ServerResponse<Campaign>> => {
	const res = await apiClient<ServerResponse<Campaign>>(`campaigns/${id}`, {
		method: "GET",
	});

	return res;
};
