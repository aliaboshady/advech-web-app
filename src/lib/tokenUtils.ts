import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIES_KEYS } from "./staticKeys";

const API_URL = import.meta.env.VITE_API_URL;
const ENV = import.meta.env.ENV;

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

const TOKEN_COOKIE_OPTIONS = {
	path: "/",
	expires: 30,
	sameSite: "Lax" as const,
	secure: window.location.protocol === "https:",
};

export function saveTokens(accessToken: string, refreshToken: string): void {
	Cookies.set(COOKIES_KEYS.accessToken, accessToken, TOKEN_COOKIE_OPTIONS);
	Cookies.set(COOKIES_KEYS.refreshToken, refreshToken, TOKEN_COOKIE_OPTIONS);
}

export function clearTokens(): void {
	Cookies.remove(COOKIES_KEYS.accessToken, { path: "/" });
	Cookies.remove(COOKIES_KEYS.refreshToken, { path: "/" });
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
		if (ENV === "DEV") console.log("🟡 ⬅️ Trying to refresh tokens");

		const refreshToken = getRefreshToken();

		if (!refreshToken) {
			return false;
		}

		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			if (ENV === "DEV") console.log("🔴 ➡️ Error refreshing tokens");
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
