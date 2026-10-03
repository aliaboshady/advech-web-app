import { describe, expect, it } from "vitest";
import { isDarkTheme } from "./theme";

describe("isDarkTheme", () => {
	it("defaults to dark when nothing is saved", () => {
		expect(isDarkTheme(null)).toBe(true);
	});

	it("respects a saved choice", () => {
		expect(isDarkTheme("dark")).toBe(true);
		expect(isDarkTheme("light")).toBe(false);
	});
});
