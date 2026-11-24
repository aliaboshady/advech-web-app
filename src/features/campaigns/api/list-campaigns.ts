import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Campaign, ListCampaignsPayload } from "../types";

/** The backend's search needs at least two characters. */
const MIN_SEARCH_LENGTH = 2;

const toQuery = (payload: ListCampaignsPayload): string => {
	const params = new URLSearchParams();
	params.set("page", String(payload.page));
	params.set("limit", String(payload.limit));

	const search = payload.search?.trim();
	if (search && search.length >= MIN_SEARCH_LENGTH) {
		params.set("search", search);
	}
	if (payload.orderBy) {
		params.set("sortBy", payload.orderBy);
	}
	if (payload.orderType) {
		params.set("sortOrder", payload.orderType.toUpperCase());
	}
	if (payload.status?.length) {
		params.set("status", payload.status.join(","));
	}
	if (payload.flightFrom) {
		params.set("flightFrom", payload.flightFrom);
	}
	if (payload.flightTo) {
		params.set("flightTo", payload.flightTo);
	}

	return params.toString();
};

/** Lists the Advertiser's Campaigns, one page at a time. */
export const listCampaigns = async (
	payload: ListCampaignsPayload,
): Promise<BackendResponse<Campaign[]>> =>
	apiClient<BackendResponse<Campaign[]>>(`campaigns?${toQuery(payload)}`, {
		method: "GET",
	});
