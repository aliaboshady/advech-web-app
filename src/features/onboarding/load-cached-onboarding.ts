import type { OnboardingState } from "./types";

type FetchOnboarding = () => Promise<OnboardingState | null>;

type CacheEntry = {
	readonly accessToken: string | null;
	readonly state: OnboardingState;
};

let cacheEntry: CacheEntry | undefined;

/** Drops the cached state so the next read fetches it again. */
export function clearCachedOnboarding(): void {
	cacheEntry = undefined;
}

/** Keeps a state the server just returned (a save, or a refetch after Consent). */
export function storeOnboarding(
	accessToken: string | null,
	state: OnboardingState,
): void {
	cacheEntry = { accessToken, state };
}

/**
 * Returns the Onboarding state for this access token, the way `me` is cached:
 * fetched again only when the token changed or the cache was cleared.
 * A failed load is not remembered.
 */
export async function loadCachedOnboarding(
	accessToken: string | null,
	fetchOnboarding: FetchOnboarding,
): Promise<OnboardingState | null> {
	if (cacheEntry !== undefined && cacheEntry.accessToken === accessToken) {
		return cacheEntry.state;
	}
	const state = await fetchOnboarding();
	if (state !== null) {
		cacheEntry = { accessToken, state };
	}
	return state;
}
