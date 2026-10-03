import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";

export type RequestAdminPasswordResetPayload = {
	readonly email: string;
};

/**
 * Asks for an Admin password reset.
 * The dev token is dropped so the page cannot tell whether the email exists.
 */
export async function requestAdminPasswordReset(
	payload: RequestAdminPasswordResetPayload,
): Promise<ServerResponse<null>> {
	const response = await apiClient<
		ServerResponse<{ devToken?: string } | null>
	>("auth/admin/password-reset/request", {
		method: "POST",
		body: JSON.stringify({ email: payload.email }),
		skipAuth: true,
	});
	if (response.error) {
		return { success: false, error: response.error };
	}
	return { success: true };
}
