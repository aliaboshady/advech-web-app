import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import {
	CreateCreativeUploadIntentPayload,
	CreativeUploadIntent,
} from "../types";

export const createCreativeUploadIntent = async ({
	campaignId,
	...payload
}: CreateCreativeUploadIntentPayload): Promise<
	BackendResponse<CreativeUploadIntent>
> => {
	const res = await apiClient<BackendResponse<CreativeUploadIntent>>(
		`campaigns/${campaignId}/creatives/upload-intent`,
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
	);

	return res;
};
