import { apiClient } from "@/api/apiClient";
import { User } from "@/features/users/types";
import { ServerResponse } from "@/types";

export const me = async (): Promise<ServerResponse<User>> => {
	const res = await apiClient<ServerResponse<User>>("users/me", {
		method: "GET",
		allowUnauthenticated: true,
	});

	return res;
};
