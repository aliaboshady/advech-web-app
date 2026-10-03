/**
 * What the login screen does after a failed attempt.
 * - `verify`: the email is not verified; open verify, resend, keep the handle.
 * - `suspended`: dead end; the account is suspended and nothing here helps.
 * - `show-error`: show the message for the code.
 */
export type LoginErrorAction = "verify" | "suspended" | "show-error";

export function loginErrorAction(code: string): LoginErrorAction {
	if (code === "ADVERTISER_EMAIL_NOT_VERIFIED") {
		return "verify";
	}
	if (code === "USER_SUSPENDED") {
		return "suspended";
	}
	return "show-error";
}
