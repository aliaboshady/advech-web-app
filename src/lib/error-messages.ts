import ar from "@/i18n/locales/ar.json";
import en from "@/i18n/locales/en.json";

const catalogs = {
	en: en.errors,
	ar: ar.errors,
} as const;

type ErrorCatalog = typeof en.errors;

/**
 * Maps a backend error code onto the message for the active language.
 * Unknown codes keep the server message.
 */
export function resolveErrorMessage(
	error: { code: string; message: string },
	language: string,
): string {
	const catalog: ErrorCatalog = language === "ar" ? catalogs.ar : catalogs.en;
	const message = catalog[error.code as keyof ErrorCatalog];
	return typeof message === "string" ? message : error.message;
}
