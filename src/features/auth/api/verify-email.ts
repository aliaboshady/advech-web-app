"use server";

import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { VerifyEmailPayload } from "../types";

export const verifyEmail = async ({
	email,
	code,
}: VerifyEmailPayload): Promise<void> => {
	await apiClient<ServerResponse<void>>(
		"auth/advertiser/verify-email", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email, code }),
			skipAuth: true,
		},
	);
};
