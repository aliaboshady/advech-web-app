import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { PlaceOption } from "../types";

/** Cities of one country, by its two-letter code. */
export const listCities = async (
	countryCode: string,
): Promise<BackendResponse<PlaceOption[]>> => {
	const res = await apiClient<BackendResponse<PlaceOption[]>>(
		`cities?countryCode=${encodeURIComponent(countryCode)}`,
		{ method: "GET" },
	);
	return res;
};
