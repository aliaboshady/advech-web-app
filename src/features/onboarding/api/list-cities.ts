import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { PlaceOption } from "../types";

/** Cities of one country, by its two-letter code. */
export const listCities = async (
	countryCode: string,
): Promise<ServerResponse<PlaceOption[]>> => {
	const res = await apiClient<ServerResponse<PlaceOption[]>>(
		`cities?countryCode=${encodeURIComponent(countryCode)}`,
		{ method: "GET" },
	);
	return res;
};
