import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { ConfirmPasswordResetPayload } from "../types";

/**
 * Sets a new password from the emailed code. Keyed by email plus code, not by
 * a Verification handle. Returns the response so a wrong or expired code
 * (`OTP_*`) reaches the caller instead of looking like success.
 */
export const confirmPasswordReset = async ({
	email,
	code,
	newPassword,
}: ConfirmPasswordResetPayload): Promise<ServerResponse<void>> => {
	const res = await apiClient<ServerResponse<void>>(
		"auth/advertiser/password-reset/confirm", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email, code, newPassword }),
			skipAuth: true,
		},
	);

	return res;
};
