import { describe, expect, it } from "vitest";
import { isPermissionDenied } from "./is-permission-denied";

describe("isPermissionDenied", () => {
	it("recognises the backend permission-denied code", () => {
		expect(isPermissionDenied({ code: "PERMISSION_DENIED" })).toBe(true);
	});

	it("does not treat another refusal as permission-denied", () => {
		expect(isPermissionDenied({ code: "USER_SUSPENDED" })).toBe(false);
	});
});
