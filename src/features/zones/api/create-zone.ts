import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { CreatePointZonePayload, Zone } from "../types";

/** Saves a Point Zone to the Advertiser's library. */
export const createZone = async (
	payload: CreatePointZonePayload,
): Promise<ServerResponse<Zone>> => {
	const response = await apiClient<ServerResponse<Zone>>("zones", {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return response;
};
