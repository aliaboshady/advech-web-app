import i18n from "@/i18n";
import { resolveErrorMessage } from "@/lib/error-messages";

/**
 * The message for an auth error code in the active language. A suspended user
 * is told the neutral message, not the Admin-facing one in the shared catalog.
 */
export function authErrorMessage(error: {
	code: string;
	message: string;
}): string {
	if (error.code === "USER_SUSPENDED") {
		return i18n.t("login.suspended");
	}
	return resolveErrorMessage(error, i18n.language);
}
