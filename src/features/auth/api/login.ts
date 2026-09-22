import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { LoginPayload, LoginResponse } from "../types";

export const login = async ({
	email,
	password,
}: LoginPayload): Promise<BackendResponse<LoginResponse>> => {
	const res = await apiClient<BackendResponse<LoginResponse>>(
		"auth/advertiser/login", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ email, password }),
			skipAuth: true,
		},
	);

	return res;
};
