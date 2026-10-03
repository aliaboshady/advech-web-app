import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Role } from "../types";

/** Lists Roles, including their Permissions and how many Admins hold each. */
export async function listRoles(): Promise<ServerResponse<Role[]>> {
	return apiClient<ServerResponse<Role[]>>("admin/roles", { method: "GET" });
}
