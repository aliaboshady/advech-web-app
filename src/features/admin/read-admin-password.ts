const ADMIN_PASSWORD_MIN_LENGTH = 12;
const ADMIN_PASSWORD_MAX_LENGTH = 128;

export type AdminPasswordProblem =
	| "passwordRequired"
	| "passwordMin"
	| "passwordMax";

/** The problem with an Admin password, or null when it is 12 to 128 characters. */
export function readAdminPassword(
	password: string,
): AdminPasswordProblem | null {
	if (password.length === 0) {
		return "passwordRequired";
	}
	if (password.length < ADMIN_PASSWORD_MIN_LENGTH) {
		return "passwordMin";
	}
	if (password.length > ADMIN_PASSWORD_MAX_LENGTH) {
		return "passwordMax";
	}
	return null;
}
