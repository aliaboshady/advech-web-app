import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { SaveOnboardingFormPayload } from "../build-onboarding-payload";
import { OnboardingState } from "../types";

/**
 * Saves one or both Onboarding form sections. The response is the Onboarding
 * state, already advanced to `PENDING_REVIEW` when nothing is left to do.
 */
export const saveOnboardingForm = async (
	payload: SaveOnboardingFormPayload,
): Promise<BackendResponse<OnboardingState>> => {
	const res = await apiClient<BackendResponse<OnboardingState>>(
		"advertiser/onboarding/form",
		{ method: "PUT", body: JSON.stringify(payload) },
	);
	return res;
};
