import { apiClient } from "@/api/apiClient";
import { User } from "@/features/users/types";
import { BackendResponse } from "@/types";

export const me = async (): Promise<BackendResponse<User>> => {
	const res = await apiClient<BackendResponse<User>>("users/me", {
		method: "GET",
		allowUnauthenticated: true,
	});

	return res;
};
