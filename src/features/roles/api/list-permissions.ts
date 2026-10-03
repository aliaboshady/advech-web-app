import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Permission } from "../types";

/** Lists Permissions the picker can offer, each with its description. */
export async function listPermissions(): Promise<ServerResponse<Permission[]>> {
	return apiClient<ServerResponse<Permission[]>>("admin/permissions", {
		method: "GET",
	});
}
