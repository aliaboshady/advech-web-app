import { describe, expect, it } from "vitest";
import { resolveTermsCopy } from "./consent-terms";

describe("resolveTermsCopy", () => {
	it("finds the copy for a version the client ships", () => {
		expect(resolveTermsCopy("1.0")).toEqual({
			copyKey: "onboarding.terms.v1_0",
		});
	});

	it("has no copy for a version the client has never seen", () => {
		expect(resolveTermsCopy("9.9")).toBeNull();
		expect(resolveTermsCopy("")).toBeNull();
	});

	it("does not match inherited object keys", () => {
		expect(resolveTermsCopy("constructor")).toBeNull();
		expect(resolveTermsCopy("__proto__")).toBeNull();
	});
});
