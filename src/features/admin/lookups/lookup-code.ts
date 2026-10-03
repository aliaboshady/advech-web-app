const LOOKUP_CODE_MIN_LENGTH = 2;
const LOOKUP_CODE_MAX_LENGTH = 64;
const LOOKUP_CODE_CHARACTERS = /^[a-z0-9_-]+$/;

export type LookupCodeIssue = "too-short" | "too-long" | "invalid";

export type LookupCodeMessageKey =
	| "lookupCodeTooShort"
	| "lookupCodeTooLong"
	| "lookupCodeInvalid";

/**
 * Why a Lookup code cannot be sent.
 * The string is checked as it will be sent: this does not trim it.
 */
export function lookupCodeIssue(code: string): LookupCodeIssue | null {
	if (code.length < LOOKUP_CODE_MIN_LENGTH) {
		return "too-short";
	}
	if (code.length > LOOKUP_CODE_MAX_LENGTH) {
		return "too-long";
	}
	if (!LOOKUP_CODE_CHARACTERS.test(code)) {
		return "invalid";
	}
	return null;
}

/** The i18n key under `errors` for a refused Lookup code. */
export function lookupCodeMessageKey(
	issue: LookupCodeIssue,
): LookupCodeMessageKey {
	if (issue === "too-short") {
		return "lookupCodeTooShort";
	}
	if (issue === "too-long") {
		return "lookupCodeTooLong";
	}
	return "lookupCodeInvalid";
}
