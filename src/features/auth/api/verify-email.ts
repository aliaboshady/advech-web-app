import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { VerifyEmailPayload, VerifyEmailResponse } from "../types";

export const verifyEmail = async ({
	token,
	code,
}: VerifyEmailPayload): Promise<BackendResponse<VerifyEmailResponse>> => {
	const res = await apiClient<BackendResponse<VerifyEmailResponse>>(
		"auth/advertiser/verify-email", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ token, code }),
			skipAuth: true,
		},
	);

	return res;
};
