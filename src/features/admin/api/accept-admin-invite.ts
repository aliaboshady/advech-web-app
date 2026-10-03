import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { AcceptAdminInvitePayload } from "../build-accept-admin-invite-payload";

/** Accepts an Admin invite. The caller must already have checked the payload. */
export async function acceptAdminInvite(
	payload: AcceptAdminInvitePayload,
): Promise<ServerResponse<null>> {
	return apiClient<ServerResponse<null>>("auth/admin/invites/accept", {
		method: "POST",
		body: JSON.stringify(payload),
		skipAuth: true,
	});
}
