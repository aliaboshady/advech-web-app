/**
 * What the verify screen does next after a failed attempt.
 * - `stay`: show the message; the user types the code again.
 * - `resend`: show the message; the user asks for a new code.
 * - `use-latest-handle`: this handle was replaced; retry with the newest one held.
 * - `restart-signup`: the handle is too old; start signup again.
 * - `continue`: the attempt already succeeded and a session exists; open the app.
 * - `login`: the attempt already succeeded and there is no session; sign in.
 */
export type VerifyErrorAction =
	| "stay"
	| "resend"
	| "use-latest-handle"
	| "restart-signup"
	| "continue"
	| "login";

export function verifyErrorAction(
	code: string,
	context: { readonly hasSession: boolean },
): VerifyErrorAction {
	switch (code) {
		case "OTP_EXPIRED":
		case "OTP_MAX_ATTEMPTS_EXCEEDED":
			return "resend";
		case "VERIFICATION_HANDLE_UNKNOWN":
			return "use-latest-handle";
		case "VERIFICATION_HANDLE_CONSUMED":
			return context.hasSession ? "continue" : "login";
		case "VERIFICATION_HANDLE_EXPIRED":
			return "restart-signup";
		default:
			// OTP_INVALID, USER_SUSPENDED, TOO_MANY_REQUESTS and unknown codes.
			return "stay";
	}
}
