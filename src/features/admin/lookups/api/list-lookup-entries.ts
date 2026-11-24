import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { LookupEntry } from "../lookup-entry";

/** Lists every entry in one Lookup, active or not. */
export async function listLookupEntries(
	collectionPath: string,
): Promise<BackendResponse<LookupEntry[]>> {
	return apiClient<BackendResponse<LookupEntry[]>>(collectionPath, {
		method: "GET",
	});
}
