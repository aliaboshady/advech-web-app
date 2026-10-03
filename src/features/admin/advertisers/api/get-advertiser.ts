import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { AdvertiserDetail } from "../advertiser-detail";

/** Loads one Advertiser so an Admin can judge it. */
export async function getAdvertiser(
	advertiserId: string,
): Promise<ServerResponse<AdvertiserDetail>> {
	return apiClient<ServerResponse<AdvertiserDetail>>(
		`admin/advertisers/${encodeURIComponent(advertiserId)}`,
		{ method: "GET" },
	);
}
