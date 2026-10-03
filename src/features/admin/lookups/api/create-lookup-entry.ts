import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { CreateLookupBody } from "../build-lookup-request";
import { LookupEntry } from "../lookup-entry";

/** Creates one Lookup entry. The code is fixed after this request. */
export async function createLookupEntry(input: {
	readonly collectionPath: string;
	readonly body: CreateLookupBody;
}): Promise<ServerResponse<LookupEntry>> {
	return apiClient<ServerResponse<LookupEntry>>(input.collectionPath, {
		method: "POST",
		body: JSON.stringify(input.body),
	});
}
