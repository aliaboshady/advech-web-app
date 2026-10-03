const PERMISSION_DENIED_CODE = "PERMISSION_DENIED";

/** Whether the backend refused an action because of Effective permissions. */
export function isPermissionDenied(error: { readonly code: string }): boolean {
	return error.code === PERMISSION_DENIED_CODE;
}
