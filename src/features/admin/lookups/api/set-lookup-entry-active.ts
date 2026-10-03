import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { LookupEntry } from "../lookup-entry";

/** Activates or deactivates a Lookup entry. There is no delete. */
export async function setLookupEntryActive(input: {
	readonly collectionPath: string;
	readonly code: string;
	readonly isActive: boolean;
}): Promise<ServerResponse<LookupEntry>> {
	const action = input.isActive ? "activate" : "deactivate";
	return apiClient<ServerResponse<LookupEntry>>(
		`${input.collectionPath}/${encodeURIComponent(input.code)}/${action}`,
		{ method: "POST" },
	);
}
