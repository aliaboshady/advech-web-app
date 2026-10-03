import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { ConfirmAdminPasswordResetPayload } from "../build-confirm-admin-password-reset-payload";

/** Sets a new Admin password from a reset token. The caller must already have checked it. */
export async function confirmAdminPasswordReset(
	payload: ConfirmAdminPasswordResetPayload,
): Promise<ServerResponse<null>> {
	return apiClient<ServerResponse<null>>("auth/admin/password-reset/confirm", {
		method: "POST",
		body: JSON.stringify(payload),
		skipAuth: true,
	});
}
