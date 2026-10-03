import { describe, expect, it } from "vitest";
import { ValidationError } from "yup";
import { roleValidationSchema } from "./role-validation";

const validRole = {
	name: "Onboarding reviewer",
	description: "Reviews driver onboarding",
	permissions: ["drivers:read"],
};

async function fieldErrors(
	values: Partial<typeof validRole>,
): Promise<Record<string, string>> {
	try {
		await roleValidationSchema.validate(
			{ ...validRole, ...values },
			{ abortEarly: false },
		);
		return {};
	} catch (error) {
		if (!(error instanceof ValidationError)) {
			throw error;
		}
		const messages: Record<string, string> = {};
		for (const issue of error.inner) {
			if (issue.path && !messages[issue.path]) {
				messages[issue.path] = issue.message;
			}
		}
		return messages;
	}
}

describe("role validation", () => {
	it("accepts a name of 2 to 100 characters and an optional description", async () => {
		await expect(
			roleValidationSchema.validate(validRole),
		).resolves.toMatchObject({
			name: "Onboarding reviewer",
			description: "Reviews driver onboarding",
		});
		expect(await fieldErrors({ name: "Ab", description: "" })).toEqual({});
		expect(await fieldErrors({ name: "A".repeat(100) })).toEqual({});
	});

	it("rejects a name shorter than 2 characters after trimming", async () => {
		expect(await fieldErrors({ name: "A" })).toEqual({ name: "roleNameMin" });
		expect(await fieldErrors({ name: " A " })).toEqual({ name: "roleNameMin" });
		expect(await fieldErrors({ name: "   " })).toEqual({
			name: "roleNameRequired",
		});
	});

	it("rejects a name longer than 100 characters", async () => {
		expect(await fieldErrors({ name: "A".repeat(101) })).toEqual({
			name: "roleNameMax",
		});
	});

	it("rejects a description longer than 500 characters", async () => {
		expect(await fieldErrors({ description: "A".repeat(501) })).toEqual({
			description: "roleDescriptionMax",
		});
		expect(await fieldErrors({ description: "A".repeat(500) })).toEqual({});
	});
});
