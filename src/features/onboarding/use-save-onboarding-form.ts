import { useRouter } from "@tanstack/react-router";
import useRequest from "@/hooks/useRequest";
import { getAccessToken } from "@/lib/tokenUtils";
import { ServerResponse } from "@/types";
import { saveOnboardingForm } from "./api/save-onboarding-form";
import type { SaveOnboardingFormPayload } from "./build-onboarding-payload";
import { storeOnboarding } from "./load-cached-onboarding";
import type { OnboardingState } from "./types";

/**
 * Saves a form section, keeps the returned state as the cached state and lets
 * the router re-run its gate, so the new `status` decides what shows next.
 */
export function useSaveOnboardingForm() {
	const router = useRouter();
	return useRequest<SaveOnboardingFormPayload, ServerResponse<OnboardingState>>(
		saveOnboardingForm,
		{
			onSuccess: async (res) => {
				if (res.data) {
					storeOnboarding(getAccessToken(), res.data);
					await router.invalidate();
				}
			},
		},
	);
}
