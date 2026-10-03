import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import {
	ADVERTISER_QUEUE_ALL,
	AdvertiserQueueStatusFilter,
	AdvertiserSummary,
} from "../advertiser-summary";

/** Lists Advertisers. The backend filters by status only, and does not page. */
export async function listAdvertisers(
	status: AdvertiserQueueStatusFilter,
): Promise<ServerResponse<AdvertiserSummary[]>> {
	const params = new URLSearchParams();
	if (status !== ADVERTISER_QUEUE_ALL) {
		params.set("status", status);
	}
	const queryString = params.toString();
	const path =
		queryString.length > 0
			? `admin/advertisers?${queryString}`
			: "admin/advertisers";
	return apiClient<ServerResponse<AdvertiserSummary[]>>(path, {
		method: "GET",
	});
}
