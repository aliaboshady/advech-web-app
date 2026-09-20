import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import {
	RequestPasswordResetPayload,
	RequestPasswordResetResponse,
} from "../types";

export const requestPasswordReset = async ({
	email,
}: RequestPasswordResetPayload): Promise<
	ServerResponse<RequestPasswordResetResponse>
> => {
	const res = await apiClient<ServerResponse<RequestPasswordResetResponse>>(
		"auth/advertiser/password-reset/request", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email }),
			skipAuth: true,
		},
	);

	return res;
};
