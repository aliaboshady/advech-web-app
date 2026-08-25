import { apiClient } from "@/api/apiClient";
import { UserResponse } from "@/features/users/types";
import { ServerResponse } from "@/types";

export const me = async (): Promise<ServerResponse<UserResponse>> => {
	const res = await apiClient<ServerResponse<UserResponse>>("users/me", {
		method: "GET",
		allowUnauthenticated: true,
	});

	return res;
};
