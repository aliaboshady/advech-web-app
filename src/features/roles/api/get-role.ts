import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Role } from "../types";

/** Loads one Role for editing. */
export async function getRole(id: string): Promise<BackendResponse<Role>> {
	return apiClient<BackendResponse<Role>>(`admin/roles/${id}`, {
		method: "GET",
	});
}
