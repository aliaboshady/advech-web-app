import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Permission } from "../types";

/** Lists Permissions the picker can offer, each with its description. */
export async function listPermissions(): Promise<
	BackendResponse<Permission[]>
> {
	return apiClient<BackendResponse<Permission[]>>("admin/permissions", {
		method: "GET",
	});
}
