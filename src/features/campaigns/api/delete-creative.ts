import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { DeleteCreativePayload } from "../types";

export const deleteCreative = async ({
	campaignId,
	creativeId,
}: DeleteCreativePayload): Promise<BackendResponse<never>> => {
	const res = await apiClient<BackendResponse<never>>(
		`campaigns/${campaignId}/creatives/${creativeId}`,
		{ method: "DELETE" },
	);

	return res;
};
