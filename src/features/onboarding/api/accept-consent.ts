import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { ConsentRecord } from "../types";

/** Accepts a terms version. Send `consent.currentVersion` from the Onboarding state, never a constant. */
export const acceptConsent = async (
	agreementVersion: string,
): Promise<ServerResponse<ConsentRecord>> => {
	const res = await apiClient<ServerResponse<ConsentRecord>>(
		"advertiser/onboarding/consent",
		{
			method: "POST",
			body: JSON.stringify({ agreementVersion }),
		},
	);
	return res;
};
