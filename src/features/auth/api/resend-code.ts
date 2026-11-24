import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { ResendCodePayload, ResendCodeResponse } from "../types";

export const resendCode = async ({
	email,
}: ResendCodePayload): Promise<BackendResponse<ResendCodeResponse>> => {
	const res = await apiClient<BackendResponse<ResendCodeResponse>>(
		"auth/advertiser/verify-email/resend", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email }),
			skipAuth: true,
		},
	);

	return res;
};
