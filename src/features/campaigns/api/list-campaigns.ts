import { apiClient } from "@/api/apiClient";
import { Paginated, PaginatedResponse, ServerResponse } from "@/types";
import { Campaign, ListCampaignsPayload } from "../types";

/** The backend's search needs at least two characters. */
const MIN_SEARCH_LENGTH = 2;

type CampaignListResponse = ServerResponse<Campaign[]> & {
	meta?: { page: number; limit: number; total: number; totalPages: number };
};

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

/** Lists the Advertiser's Campaigns, reshaping the backend's `meta` into `Paginated`. */
export const listCampaigns = async (
	payload: ListCampaignsPayload,
): Promise<PaginatedResponse<Campaign>> => {
	const res = await apiClient<CampaignListResponse>(
		`campaigns?${toQuery(payload)}`,
		{ method: "GET" },
	);

	if (res.error || !res.data || !res.meta) {
		return { error: res.error };
	}

	const { page, limit, total, totalPages } = res.meta;
	const paginated: Paginated<Campaign> = {
		docs: res.data,
		limit,
		totalItems: total,
		page,
		totalPages,
		hasPreviousPage: page > 1,
		hasNextPage: page < totalPages,
	};

	return { success: res.success, data: paginated };
};
