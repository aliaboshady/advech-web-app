import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { CreateLookupBody } from "../build-lookup-request";
import { CreateSchedulePresetBody } from "../build-schedule-preset-request";
import { LookupEntry } from "../lookup-entry";

/** Creates one Lookup entry. The code is fixed after this request. */
export async function createLookupEntry(input: {
	readonly collectionPath: string;
	readonly body: CreateLookupBody | CreateSchedulePresetBody;
}): Promise<BackendResponse<LookupEntry>> {
	return apiClient<BackendResponse<LookupEntry>>(input.collectionPath, {
		method: "POST",
		body: JSON.stringify(input.body),
	});
}
