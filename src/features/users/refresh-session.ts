import { clearCachedMe } from "./load-cached-me";

type RefreshSession = () => void;

let refreshSession: RefreshSession | undefined;

/** Root registers this so a later refusal can refetch `me`. */
export function registerSessionRefresh(refresh: RefreshSession): void {
	refreshSession = refresh;
}

/** Drops the cached `me` and asks the app to load it again. */
export function requestSessionRefresh(): void {
	clearCachedMe();
	refreshSession?.();
}
