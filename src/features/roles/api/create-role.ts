import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Role, RoleWritePayload } from "../types";

/** Creates a Role. */
export async function createRole(
	payload: RoleWritePayload,
): Promise<BackendResponse<Role>> {
	return apiClient<BackendResponse<Role>>("admin/roles", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}
