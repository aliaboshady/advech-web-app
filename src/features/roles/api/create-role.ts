import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Role, RoleWritePayload } from "../types";

/** Creates a Role. */
export async function createRole(
	payload: RoleWritePayload,
): Promise<ServerResponse<Role>> {
	return apiClient<ServerResponse<Role>>("admin/roles", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}
