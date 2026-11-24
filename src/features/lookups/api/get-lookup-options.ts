import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { LookupOptions } from "../types";

/** Loads objectives, presets, interests, venue types, currencies and time zones. */
export const getLookupOptions = async (): Promise<
	BackendResponse<LookupOptions>
> => {
	const response = await apiClient<BackendResponse<LookupOptions>>(
		"lookups/options",
		{ method: "GET" },
	);
	return response;
};
