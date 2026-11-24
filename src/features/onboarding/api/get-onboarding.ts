import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { OnboardingState } from "../types";

/** The Advertiser's Onboarding state. Allowed at any Advertiser status. */
export const getOnboarding = async (): Promise<
	BackendResponse<OnboardingState>
> => {
	const res = await apiClient<BackendResponse<OnboardingState>>(
		"advertiser/onboarding",
		{ method: "GET" },
	);
	return res;
};
