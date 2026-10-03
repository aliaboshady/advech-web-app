import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Role, UpdateRoleInput } from "../types";

/** Replaces a Role's name, description and Permissions. */
export async function updateRole({
	id,
	payload,
}: UpdateRoleInput): Promise<ServerResponse<Role>> {
	return apiClient<ServerResponse<Role>>(`admin/roles/${id}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
}
