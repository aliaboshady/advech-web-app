import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { LookupOptions } from "../types";

/** Loads objectives, presets, interests, venue types, currencies and time zones. */
export const getLookupOptions = async (): Promise<
	ServerResponse<LookupOptions>
> => {
	const response = await apiClient<ServerResponse<LookupOptions>>(
		"lookups/options",
		{ method: "GET" },
	);
	return response;
};
