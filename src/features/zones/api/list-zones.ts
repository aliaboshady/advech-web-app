import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Zone } from "../types";

/** The Advertiser's Zone library, ordered by name. */
export const listZones = async (): Promise<ServerResponse<Zone[]>> => {
	const response = await apiClient<ServerResponse<Zone[]>>("zones", {
		method: "GET",
	});
	return response;
};
