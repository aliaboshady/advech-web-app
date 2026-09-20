import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { LoginPayload, LoginResponse } from "../types";

export const login = async ({
	email,
	password,
}: LoginPayload): Promise<ServerResponse<LoginResponse>> => {
	const res = await apiClient<ServerResponse<LoginResponse>>(
		"auth/advertiser/login", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email, password }),
			skipAuth: true,
		},
	);

	return res;
};
