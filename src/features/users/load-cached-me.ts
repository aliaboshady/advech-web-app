import { User } from "./types";

type FetchMe = () => Promise<User | null>;

type CacheEntry = {
	readonly accessToken: string | null;
	readonly user: User | null;
};

let cacheEntry: CacheEntry | undefined;

/** Drops the cached me so the next read fetches it again. */
export function clearCachedMe(): void {
	cacheEntry = undefined;
}

/**
 * Returns me for this access token.
 * Fetches again only when the token changed or the cache was cleared.
 */
export async function loadCachedMe(
	accessToken: string | null,
	fetchMe: FetchMe,
): Promise<User | null> {
	if (cacheEntry !== undefined && cacheEntry.accessToken === accessToken) {
		return cacheEntry.user;
	}
	const user = await fetchMe();
	cacheEntry = { accessToken, user };
	return user;
}
