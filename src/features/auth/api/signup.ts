import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { SignupPayload, SignupResponse } from "../types";

export const signup = async ({
	email,
	password,
}: SignupPayload): Promise<ServerResponse<SignupResponse>> => {
	const res = await apiClient<ServerResponse<SignupResponse>>(
		"auth/advertiser/signup", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email, password }),
			skipAuth: true,
		},
	);

	return res;
};
