import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { OnboardingState } from "../types";

/** The Advertiser's Onboarding state. Allowed at any Advertiser status. */
export const getOnboarding = async (): Promise<
	ServerResponse<OnboardingState>
> => {
	const res = await apiClient<ServerResponse<OnboardingState>>(
		"advertiser/onboarding",
		{ method: "GET" },
	);
	return res;
};
