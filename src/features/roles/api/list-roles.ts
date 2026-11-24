import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Role } from "../types";

/** Lists Roles, including their Permissions and how many Admins hold each. */
export async function listRoles(): Promise<BackendResponse<Role[]>> {
	return apiClient<BackendResponse<Role[]>>("admin/roles", { method: "GET" });
}
