export const THEME_STORAGE_KEY = "theme";

/** Dark is the default; a saved "light" or "dark" choice wins. */
export function isDarkTheme(savedTheme: string | null): boolean {
	return savedTheme ? savedTheme === "dark" : true;
}
