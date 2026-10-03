import { apiClient } from "@/api/apiClient";
import { getRefreshToken } from "@/lib/tokenUtils";

/**
 * Ends the current session on the shared logout route.
 * The route revokes whatever refresh token it is given, Admin or Advertiser.
 */
export async function logoutSession(): Promise<void> {
	const refreshToken = getRefreshToken();
	if (refreshToken === null) {
		return;
	}
	await apiClient("auth/logout", {
		method: "POST",
		body: JSON.stringify({ refreshToken }),
		skipAuth: true,
	});
}
