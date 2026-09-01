"use server";

import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { ConfirmPasswordResetPayload } from "../types";

export const confirmPasswordReset = async ({
	email,
	code,
	newPassword,
}: ConfirmPasswordResetPayload): Promise<void> => {
	await apiClient<ServerResponse<void>>(
		"auth/advertiser/password-reset/confirm", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email, code, newPassword }),
			skipAuth: true,
		},
	);
};
