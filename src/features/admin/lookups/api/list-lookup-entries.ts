import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { LookupEntry } from "../lookup-entry";

/** Lists every entry in one Lookup, active or not. */
export async function listLookupEntries(
	collectionPath: string,
): Promise<ServerResponse<LookupEntry[]>> {
	return apiClient<ServerResponse<LookupEntry[]>>(collectionPath, {
		method: "GET",
	});
}
