import { jwtDecode } from "jwt-decode";
import { COOKIES_KEYS } from "./staticKeys";

interface JwtPayload {
	sub: string;
	exp: number;
}

export function getAccessToken(): string | null {
	return localStorage.getItem(COOKIES_KEYS.accessToken);
}

export function getRefreshToken(): string | null {
	return localStorage.getItem(COOKIES_KEYS.refreshToken);
}

export function saveTokens(accessToken: string, refreshToken: string): void {
	localStorage.setItem(COOKIES_KEYS.accessToken, accessToken);
	localStorage.setItem(COOKIES_KEYS.refreshToken, refreshToken);
}

export function clearTokens(): void {
	localStorage.removeItem(COOKIES_KEYS.accessToken);
	localStorage.removeItem(COOKIES_KEYS.refreshToken);
}

export function getUserIdFromToken(token: string): string | null {
	try {
		const { sub } = jwtDecode<JwtPayload>(token);
		return sub;
	} catch {
		return null;
	}
}

export function isTokenExpired(token: string): boolean {
	try {
		const { exp } = jwtDecode<JwtPayload>(token);

		// Consider expired 10 seconds early.
		return exp * 1000 < Date.now() + 10_000;
	} catch {
		return true;
	}
}

export async function refreshAccessToken(): Promise<boolean> {
	try {
		console.log("🟡 ⬅️ Trying to refresh tokens");

		const refreshToken = getRefreshToken();

		if (!refreshToken) {
			return false;
		}

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/users/refresh-token`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					refreshToken,
				}),
			},
		);

		if (!response.ok) {
			console.log("🔴 ➡️ Error refreshing tokens");

			clearTokens();

			return false;
		}

		const result = await response.json();

		const { accessToken, refreshToken: newRefreshToken } = result.data;

		saveTokens(accessToken, newRefreshToken || refreshToken);

		return true;
	} catch (error) {
		console.error("🔴 ➡️ Failed to refresh tokens:", error);

		clearTokens();

		return false;
	}
}
