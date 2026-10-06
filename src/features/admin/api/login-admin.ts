import { apiClient } from "@/api/apiClient";
import { LoginPayload, LoginResponse } from "@/features/auth/types";
import { BackendResponse } from "@/types";

/** Signs an Admin in with email and password. */
export async function loginAdmin({
	email,
	password,
}: LoginPayload): Promise<BackendResponse<LoginResponse>> {
	return apiClient<BackendResponse<LoginResponse>>("auth/admin/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
		skipAuth: true,
	});
}
