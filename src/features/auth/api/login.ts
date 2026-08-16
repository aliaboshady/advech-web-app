"use server";

import { apiClient } from "@/api/apiClient";
import { saveTokens } from "@/lib/tokenUtils";
import { ServerResponse } from "@/types";
import { LoginPayload, LoginResponse } from "../types";

export const login = async ({
	username,
	password,
}: LoginPayload): Promise<ServerResponse<LoginResponse>> => {
	const res = await apiClient<ServerResponse<LoginResponse>>(
		"auth/advertiser/login", // TODO: Remove "advertiser" from the endpoint later
		{
			method: "POST",
			body: JSON.stringify({ username, password }),
			skipAuth: true,
		},
	);

	if (res?.data) {
		const { refreshToken, accessToken } = res?.data;
		if (refreshToken && accessToken) {
			await Promise.all([saveTokens(accessToken, refreshToken)]);
		}
	}

	return res;
};
