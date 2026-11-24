import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";

/** Deletes a Role. Admins who held it lose its Permissions. */
export async function deleteRole(id: string): Promise<BackendResponse<null>> {
	return apiClient<BackendResponse<null>>(`admin/roles/${id}`, {
		method: "DELETE",
	});
}
