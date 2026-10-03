import { describe, expect, it } from "vitest";
import {
	buildCreateRolePayload,
	buildUpdateRolePayload,
} from "./build-role-payload";

describe("buildCreateRolePayload", () => {
	it("trims the name and omits a blank description", () => {
		expect(
			buildCreateRolePayload({
				name: "  Onboarding reviewer  ",
				description: "   ",
				permissions: ["drivers:read", "documents:review"],
			}),
		).toEqual({
			name: "Onboarding reviewer",
			permissions: ["drivers:read", "documents:review"],
		});
	});

	it("sends a description when one was entered", () => {
		expect(
			buildCreateRolePayload({
				name: "Lookup editor",
				description: "  Keeps the Lookups tidy  ",
				permissions: ["lookups:manage"],
			}),
		).toEqual({
			name: "Lookup editor",
			description: "Keeps the Lookups tidy",
			permissions: ["lookups:manage"],
		});
	});
});

describe("buildUpdateRolePayload", () => {
	it("sends the full permission list, including keys already on the Role", () => {
		expect(
			buildUpdateRolePayload({
				name: " Reviewer ",
				description: " Reviews documents ",
				permissions: [
					"drivers:read",
					"documents:review",
					"roles:manage",
					"drivers:read",
				],
			}),
		).toEqual({
			name: "Reviewer",
			description: "Reviews documents",
			permissions: ["drivers:read", "documents:review", "roles:manage"],
		});
	});

	it("sends an empty description and an empty permission list when both were cleared", () => {
		expect(
			buildUpdateRolePayload({
				name: "Reviewer",
				description: "  ",
				permissions: [],
			}),
		).toEqual({
			name: "Reviewer",
			description: "",
			permissions: [],
		});
	});
});
