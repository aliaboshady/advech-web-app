import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { MeResponse } from "../types";

export const me = async (): Promise<ServerResponse<MeResponse>> => {
	const res = await apiClient<ServerResponse<MeResponse>>("auth/me", {
		method: "GET",
		allowUnauthenticated: true,
	});

	return res;
};
