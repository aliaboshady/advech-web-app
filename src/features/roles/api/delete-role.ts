import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";

/** Deletes a Role. Admins who held it lose its Permissions. */
export async function deleteRole(id: string): Promise<ServerResponse<null>> {
	return apiClient<ServerResponse<null>>(`admin/roles/${id}`, {
		method: "DELETE",
	});
}
