import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { ConsentRecord } from "../types";

/** Accepts a terms version. Send `consent.currentVersion` from the Onboarding state, never a constant. */
export const acceptConsent = async (
	agreementVersion: string,
): Promise<BackendResponse<ConsentRecord>> => {
	const res = await apiClient<BackendResponse<ConsentRecord>>(
		"advertiser/onboarding/consent",
		{
			method: "POST",
			body: JSON.stringify({ agreementVersion }),
		},
	);
	return res;
};
