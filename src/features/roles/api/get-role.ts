import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Role } from "../types";

/** Loads one Role for editing. */
export async function getRole(id: string): Promise<ServerResponse<Role>> {
	return apiClient<ServerResponse<Role>>(`admin/roles/${id}`, {
		method: "GET",
	});
}
