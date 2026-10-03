import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import {
	CreateCreativeUploadIntentPayload,
	CreativeUploadIntent,
} from "../types";

export const createCreativeUploadIntent = async ({
	campaignId,
	...payload
}: CreateCreativeUploadIntentPayload): Promise<
	ServerResponse<CreativeUploadIntent>
> => {
	const res = await apiClient<ServerResponse<CreativeUploadIntent>>(
		`campaigns/${campaignId}/creatives/upload-intent`,
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
	);

	return res;
};
