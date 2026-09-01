import {
	clearTokens,
	getAccessToken,
	isTokenExpired,
	refreshAccessToken,
} from "@/lib/tokenUtils";
import { getRouter } from "@/router";

interface FetchOptions extends RequestInit {
	skipAuth?: boolean;
	refreshTokens?: boolean;
	allowUnauthenticated?: boolean;
	skipParseJson?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;
const ENV = import.meta.env.ENV;

function redirectToLogin(): never {
	clearTokens();

	const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
	const redirectUrl = window.location.pathname === "/" ? undefined : currentUrl;

	getRouter().navigate({
		to: "/auth/login",
		search: { redirectUrl },
	});

	throw new Error("Authentication expired");
}

async function getValidAccessToken(
	forceRefresh = false,
): Promise<string | null> {
	const accessToken = getAccessToken();

	if (!accessToken) {
		return null;
	}

	if (!forceRefresh && !isTokenExpired(accessToken)) {
		return accessToken;
	}

	const refreshed = await refreshAccessToken();

	if (!refreshed) {
		return null;
	}

	const refreshedAccessToken = getAccessToken();

	return refreshedAccessToken;
}

export async function apiClient<T>(
	endpoint: string,
	options: FetchOptions = {},
): Promise<T> {
	const {
		skipAuth = false,
		refreshTokens: shouldRefreshTokens = true,
		allowUnauthenticated = false,
		skipParseJson = false,
		...fetchOptions
	} = options;

	const headers = new Headers(fetchOptions.headers);

	// --------------------------------
	// Authentication
	// --------------------------------

	if (!skipAuth) {
		let accessToken = getAccessToken();

		// Refresh an expired access token before making the request.
		if (accessToken && isTokenExpired(accessToken) && shouldRefreshTokens) {
			accessToken = await getValidAccessToken();
		}

		if (!accessToken) {
			if (allowUnauthenticated) {
				return null as T;
			}

			return redirectToLogin();
		}

		headers.set("Authorization", `Bearer ${accessToken}`);
	}

	// --------------------------------
	// Request headers
	// --------------------------------

	if (
		!headers.has("Content-Type") &&
		fetchOptions.method &&
		fetchOptions.method !== "GET" &&
		!(fetchOptions.body instanceof FormData)
	) {
		headers.set("Content-Type", "application/json");
	}

	const finalOptions: RequestInit = {
		...fetchOptions,
		headers,
	};

	try {
		if (ENV === "DEV") console.log("🔵 ⬅️ Request:", endpoint, finalOptions);

		let response = await fetch(`${API_URL}/${endpoint}`, finalOptions);

		// --------------------------------
		// Handle 401
		// --------------------------------

		if (response.status === 401 && !skipAuth && shouldRefreshTokens) {
			const accessToken = await getValidAccessToken(true);

			if (accessToken) {
				headers.set("Authorization", `Bearer ${accessToken}`);

				response = await fetch(`${API_URL}/${endpoint}`, {
					...finalOptions,
					headers,
				});
			}

			// Refresh failed or retry still returned an error.
			if (!response.ok) {
				if (allowUnauthenticated) {
					return null as T;
				}

				return redirectToLogin();
			}
		}

		// --------------------------------
		// Response
		// --------------------------------

		if (skipParseJson) {
			return response as unknown as T;
		}

		const json = await response.json();

		if (ENV === "DEV") console.log("🟢 ➡️ Response:", endpoint, json);

		return json as T;
	} catch (error) {
		console.error("🔴 ➡️ Request error:", endpoint, error);

		throw error;
	}
}
