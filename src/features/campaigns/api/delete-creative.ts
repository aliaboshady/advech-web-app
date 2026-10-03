import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { DeleteCreativePayload } from "../types";

export const deleteCreative = async ({
	campaignId,
	creativeId,
}: DeleteCreativePayload): Promise<ServerResponse<never>> => {
	const res = await apiClient<ServerResponse<never>>(
		`campaigns/${campaignId}/creatives/${creativeId}`,
		{ method: "DELETE" },
	);

	return res;
};
