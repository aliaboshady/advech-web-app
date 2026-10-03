import { describe, expect, it } from "vitest";
import { lookupCodeIssue } from "./lookup-code";

describe("lookupCodeIssue", () => {
	it("accepts 2 to 64 lowercase letters, digits, hyphens and underscores", () => {
		expect(lookupCodeIssue("ab")).toBeNull();
		expect(lookupCodeIssue("brand-awareness")).toBeNull();
		expect(lookupCodeIssue("peak_hours")).toBeNull();
		expect(lookupCodeIssue("zone-1")).toBeNull();
		expect(lookupCodeIssue("a".repeat(64))).toBeNull();
	});

	it("rejects a code shorter than 2 characters", () => {
		expect(lookupCodeIssue("")).toBe("too-short");
		expect(lookupCodeIssue("a")).toBe("too-short");
	});

	it("rejects a code longer than 64 characters", () => {
		expect(lookupCodeIssue("a".repeat(65))).toBe("too-long");
	});

	it("rejects uppercase letters", () => {
		expect(lookupCodeIssue("Brand")).toBe("invalid");
		expect(lookupCodeIssue("AB")).toBe("invalid");
	});

	it("rejects spaces", () => {
		expect(lookupCodeIssue("brand awareness")).toBe("invalid");
	});

	it("rejects punctuation other than hyphens and underscores", () => {
		expect(lookupCodeIssue("brand.awareness")).toBe("invalid");
		expect(lookupCodeIssue("brand/awareness")).toBe("invalid");
	});
});
