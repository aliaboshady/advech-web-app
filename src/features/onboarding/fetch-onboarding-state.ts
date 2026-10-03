import { getOnboarding } from "./api/get-onboarding";
import { loadCachedOnboarding } from "./load-cached-onboarding";
import type { OnboardingState } from "./types";

/** The state from the cache, or the server when the cache is empty. */
export async function fetchOnboardingState(
	accessToken: string | null,
): Promise<OnboardingState | null> {
	return loadCachedOnboarding(accessToken, async () => {
		const response = await getOnboarding();
		return response?.data ?? null;
	});
}
