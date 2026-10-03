import { apiClient } from "@/api/apiClient";
import { LoginPayload, LoginResponse } from "@/features/auth/types";
import { ServerResponse } from "@/types";

/** Signs an Admin in with email and password. */
export async function loginAdmin({
	email,
	password,
}: LoginPayload): Promise<ServerResponse<LoginResponse>> {
	return apiClient<ServerResponse<LoginResponse>>("auth/admin/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
		skipAuth: true,
	});
}
