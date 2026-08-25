import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIES_KEYS } from "./staticKeys";

interface JwtPayload {
	sub: string;
	exp: number;
}

export function getAccessToken(): string | null {
	return Cookies.get(COOKIES_KEYS.accessToken) ?? null;
}

export function getRefreshToken(): string | null {
	return Cookies.get(COOKIES_KEYS.refreshToken) ?? null;
}

export function saveTokens(accessToken: string, refreshToken: string): void {
	Cookies.set(COOKIES_KEYS.accessToken, accessToken);
	Cookies.set(COOKIES_KEYS.refreshToken, refreshToken);
}

export function clearTokens(): void {
	Cookies.remove(COOKIES_KEYS.accessToken);
	Cookies.remove(COOKIES_KEYS.refreshToken);
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
			`${import.meta.env.VITE_API_URL}/auth/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refreshToken }),
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
