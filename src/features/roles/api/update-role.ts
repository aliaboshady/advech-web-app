import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Role, UpdateRoleInput } from "../types";

/** Replaces a Role's name, description and Permissions. */
export async function updateRole({
	id,
	payload,
}: UpdateRoleInput): Promise<BackendResponse<Role>> {
	return apiClient<BackendResponse<Role>>(`admin/roles/${id}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
}
