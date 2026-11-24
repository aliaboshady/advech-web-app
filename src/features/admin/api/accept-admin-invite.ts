import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { AcceptAdminInvitePayload } from "../build-accept-admin-invite-payload";

/** Accepts an Admin invite. The caller must already have checked the payload. */
export async function acceptAdminInvite(
	payload: AcceptAdminInvitePayload,
): Promise<BackendResponse<null>> {
	return apiClient<BackendResponse<null>>("auth/admin/invites/accept", {
		method: "POST",
		body: JSON.stringify(payload),
		skipAuth: true,
	});
}
