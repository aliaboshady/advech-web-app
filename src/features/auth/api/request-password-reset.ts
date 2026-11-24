import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import {
	RequestPasswordResetPayload,
	RequestPasswordResetResponse,
} from "../types";

export const requestPasswordReset = async ({
	email,
}: RequestPasswordResetPayload): Promise<
	BackendResponse<RequestPasswordResetResponse>
> => {
	const res = await apiClient<BackendResponse<RequestPasswordResetResponse>>(
		"auth/advertiser/password-reset/request", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email }),
			skipAuth: true,
		},
	);

	return res;
};
