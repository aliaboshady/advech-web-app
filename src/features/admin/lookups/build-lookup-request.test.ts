import { describe, expect, it } from "vitest";
import {
	buildCreateLookupBody,
	buildUpdateLookupBody,
} from "./build-lookup-request";

const values = {
	code: "  brand-awareness  ",
	name: "  Brand awareness  ",
	description: "  Reach people  ",
	sortOrder: "10",
};

describe("buildCreateLookupBody", () => {
	it("sends a trimmed code, name, description and sort order", () => {
		expect(buildCreateLookupBody(values)).toEqual({
			code: "brand-awareness",
			name: "Brand awareness",
			description: "Reach people",
			sortOrder: 10,
		});
	});

	it("accepts hyphens and underscores in the code", () => {
		expect(buildCreateLookupBody({ ...values, code: "peak_hours" })?.code).toBe(
			"peak_hours",
		);
		expect(buildCreateLookupBody({ ...values, code: "zone-1" })?.code).toBe(
			"zone-1",
		);
	});

	it("omits an empty description and an empty sort order", () => {
		expect(
			buildCreateLookupBody({
				...values,
				description: "   ",
				sortOrder: "",
			}),
		).toEqual({
			code: "brand-awareness",
			name: "Brand awareness",
		});
	});

	it("does not build a body when the code is too short, too long, uppercase or spaced", () => {
		expect(buildCreateLookupBody({ ...values, code: "a" })).toBeNull();
		expect(
			buildCreateLookupBody({ ...values, code: "a".repeat(65) }),
		).toBeNull();
		expect(buildCreateLookupBody({ ...values, code: "Brand" })).toBeNull();
		expect(
			buildCreateLookupBody({ ...values, code: "brand awareness" }),
		).toBeNull();
	});
});

describe("buildUpdateLookupBody", () => {
	it("sends the name, description and sort order", () => {
		expect(buildUpdateLookupBody(values)).toEqual({
			name: "Brand awareness",
			description: "Reach people",
			sortOrder: 10,
		});
	});

	it("never sends the code or the active flag", () => {
		const body = buildUpdateLookupBody({
			...values,
			description: "",
			sortOrder: "0",
		});
		expect(body).toEqual({
			name: "Brand awareness",
			description: "",
			sortOrder: 0,
		});
		expect(body).not.toHaveProperty("code");
		expect(body).not.toHaveProperty("isActive");
	});

	it("omits a blank sort order and keeps a cleared description", () => {
		expect(
			buildUpdateLookupBody({
				...values,
				description: "   ",
				sortOrder: "   ",
			}),
		).toEqual({
			name: "Brand awareness",
			description: "",
		});
	});
});
