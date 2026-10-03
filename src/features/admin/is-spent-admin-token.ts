import { isErrorResponse } from "@/lib/utils";

/** True when an invite or reset link is expired or already used. */
export function isSpentAdminToken(error: unknown): boolean {
	return (
		isErrorResponse(error) &&
		(error.code === "ADMIN_TOKEN_EXPIRED" ||
			error.code === "ADMIN_TOKEN_INVALID")
	);
}
