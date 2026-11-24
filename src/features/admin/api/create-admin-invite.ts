import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { AdminInviteRequest } from "../build-admin-invite-request";

/** Invite the backend created. `devToken` is only present in dev. */
export type CreatedAdminInvite = {
	readonly email: string;
	readonly expiresAt: string;
	readonly devToken?: string;
};

/** Sends an Admin invite. The backend still enforces `admins:invite`. */
export async function createAdminInvite(
	request: AdminInviteRequest,
): Promise<BackendResponse<CreatedAdminInvite>> {
	return apiClient<BackendResponse<CreatedAdminInvite>>("admin/invites", {
		method: "POST",
		body: JSON.stringify(request),
	});
}
