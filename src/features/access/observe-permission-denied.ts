import { requestSessionRefresh } from "@/features/users/refresh-session";
import { ErrorResponse } from "@/types";
import { isPermissionDenied } from "./is-permission-denied";
import { notePermissionDenied } from "./permission-denied-state";

/**
 * Records a permission refusal from a route loader and reloads `me`.
 * The request hook does the same for actions started from a page.
 */
export function observePermissionDenied(
	error: Pick<ErrorResponse, "code"> | undefined,
): void {
	if (error === undefined || !isPermissionDenied(error)) {
		return;
	}
	notePermissionDenied();
	requestSessionRefresh();
}
