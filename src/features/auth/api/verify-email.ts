import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { VerifyEmailPayload, VerifyEmailResponse } from "../types";

export const verifyEmail = async ({
	token,
	code,
}: VerifyEmailPayload): Promise<ServerResponse<VerifyEmailResponse>> => {
	const res = await apiClient<ServerResponse<VerifyEmailResponse>>(
		"auth/advertiser/verify-email", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ token, code }),
			skipAuth: true,
		},
	);

	return res;
};
