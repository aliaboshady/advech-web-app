import { useRouter } from "@tanstack/react-router";
import useRequest from "@/hooks/useRequest";
import { getAccessToken } from "@/lib/tokenUtils";
import { ServerResponse } from "@/types";
import { saveOnboardingForm } from "./api/save-onboarding-form";
import type { SaveOnboardingFormPayload } from "./build-onboarding-payload";
import {
	clearCachedOnboarding,
	storeOnboarding,
} from "./load-cached-onboarding";
import { isFormLocked } from "./onboarding-errors";
import type { OnboardingState } from "./types";

/**
 * Saves a form section, keeps the returned state as the cached state and lets
 * the router re-run its gate, so the new `status` decides what shows next.
 * A locked form (409) reloads the state instead, which swaps in the status screen.
 */
export function useSaveOnboardingForm() {
	const router = useRouter();
	return useRequest<SaveOnboardingFormPayload, ServerResponse<OnboardingState>>(
		saveOnboardingForm,
		{
			onError: (error) => {
				if ("code" in error && isFormLocked(error)) {
					// The status locked the form meanwhile: reload the state so the
					// status screen replaces the form.
					clearCachedOnboarding();
					void router.invalidate();
				}
			},
			onSuccess: async (res) => {
				if (res.data) {
					storeOnboarding(getAccessToken(), res.data);
					await router.invalidate();
				}
			},
		},
	);
}
