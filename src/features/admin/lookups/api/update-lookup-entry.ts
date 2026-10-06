import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { UpdateLookupBody } from "../build-lookup-request";
import { UpdateSchedulePresetBody } from "../build-schedule-preset-request";
import { LookupEntry } from "../lookup-entry";

/** Edits a Lookup entry's name, description and sort order. */
export async function updateLookupEntry(input: {
	readonly collectionPath: string;
	readonly code: string;
	readonly body: UpdateLookupBody | UpdateSchedulePresetBody;
}): Promise<BackendResponse<LookupEntry>> {
	return apiClient<BackendResponse<LookupEntry>>(
		`${input.collectionPath}/${encodeURIComponent(input.code)}`,
		{
			method: "PATCH",
			body: JSON.stringify(input.body),
		},
	);
}
