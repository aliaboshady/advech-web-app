const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AdminInviteRequest = {
	readonly email: string;
};

export type AdminInviteBuildResult =
	| { readonly ok: true; readonly request: AdminInviteRequest }
	| {
			readonly ok: false;
			readonly reason: "email-required" | "email-invalid";
	  };

/**
 * Builds the invite body. The email is trimmed. A blank or invalid
 * address is refused before the request is sent.
 */
export function buildAdminInviteRequest(email: string): AdminInviteBuildResult {
	const trimmedEmail = email.trim();
	if (trimmedEmail.length === 0) {
		return { ok: false, reason: "email-required" };
	}
	if (!EMAIL_PATTERN.test(trimmedEmail)) {
		return { ok: false, reason: "email-invalid" };
	}
	return { ok: true, request: { email: trimmedEmail } };
}
