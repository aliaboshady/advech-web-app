import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { AdvertiserDetail } from "../advertiser-detail";

/** Loads one Advertiser so an Admin can judge it. */
export async function getAdvertiser(
	advertiserId: string,
): Promise<BackendResponse<AdvertiserDetail>> {
	return apiClient<BackendResponse<AdvertiserDetail>>(
		`admin/advertisers/${encodeURIComponent(advertiserId)}`,
		{ method: "GET" },
	);
}
