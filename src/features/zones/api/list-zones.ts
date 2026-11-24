import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Zone } from "../types";

/** The Advertiser's Zone library, ordered by name. */
export const listZones = async (): Promise<BackendResponse<Zone[]>> => {
	const response = await apiClient<BackendResponse<Zone[]>>("zones", {
		method: "GET",
	});
	return response;
};
