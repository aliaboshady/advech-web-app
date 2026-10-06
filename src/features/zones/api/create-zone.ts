import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { CreatePointZonePayload, Zone } from "../types";

/** Saves a Point Zone to the Advertiser's library. */
export const createZone = async (
	payload: CreatePointZonePayload,
): Promise<BackendResponse<Zone>> => {
	const response = await apiClient<BackendResponse<Zone>>("zones", {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return response;
};
