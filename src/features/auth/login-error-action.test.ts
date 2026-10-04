import { describe, expect, it } from "vitest";
import { loginErrorAction } from "./login-error-action";

describe("loginErrorAction", () => {
	it("sends an unverified email to the verify screen", () => {
		expect(loginErrorAction("ADVERTISER_EMAIL_NOT_VERIFIED")).toBe("verify");
	});

	it("ends at a message for a suspended account", () => {
		expect(loginErrorAction("USER_SUSPENDED")).toBe("suspended");
	});

	it("shows a message for wrong credentials, throttling and anything unknown", () => {
		expect(loginErrorAction("ADVERTISER_INVALID_CREDENTIALS")).toBe(
			"show-error",
		);
		expect(loginErrorAction("TOO_MANY_REQUESTS")).toBe("show-error");
		expect(loginErrorAction("SOMETHING_NEW")).toBe("show-error");
	});
});
