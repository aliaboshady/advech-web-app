import { describe, expect, it } from "vitest";
import { ValidationError } from "yup";
import { identityValidationSchema } from "./identity-validation";

const validIdentity = {
	name: "Ramadan brand push",
	objectiveCode: "foot-traffic",
	startDate: "2026-10-01",
	endDate: "2026-10-31",
	totalAmount: "15000.00",
	dailyAmount: "500",
	currency: "EGP",
};

async function fieldErrors(
	values: Partial<typeof validIdentity>,
): Promise<Record<string, string>> {
	try {
		await identityValidationSchema.validate(
			{ ...validIdentity, ...values },
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

describe("identity validation", () => {
	it("accepts a name, Objective, Flight and Budget within the backend limits", async () => {
		await expect(
			identityValidationSchema.validate(validIdentity),
		).resolves.toMatchObject(validIdentity);
	});

	it("rejects a name shorter than 3 or longer than 120 characters", async () => {
		expect((await fieldErrors({ name: "ab" })).name).toBe("nameMin");
		expect((await fieldErrors({ name: "a".repeat(121) })).name).toBe("nameMax");
	});

	it("requires an Objective code", async () => {
		expect((await fieldErrors({ objectiveCode: "" })).objectiveCode).toBe(
			"objectiveRequired",
		);
	});

	it("rejects a Flight that is not a real calendar day or that ends before it starts", async () => {
		expect((await fieldErrors({ startDate: "2026-02-30" })).startDate).toBe(
			"invalidFlightDate",
		);
		expect(
			(await fieldErrors({ startDate: "2026-10-31", endDate: "2026-10-01" }))
				.endDate,
		).toBe("flightDatesInvalid");
	});

	it("allows a Flight that starts and ends on the same day, and an empty Flight", async () => {
		await expect(
			identityValidationSchema.validate({
				...validIdentity,
				startDate: "2026-10-01",
				endDate: "2026-10-01",
			}),
		).resolves.toBeTruthy();
		expect(
			await fieldErrors({
				startDate: "",
				endDate: "",
				totalAmount: "",
				dailyAmount: "",
				currency: "",
			}),
		).toEqual({});
	});

	it("rejects a Budget amount that is not a non-negative decimal with at most 4 places", async () => {
		expect((await fieldErrors({ totalAmount: "-1" })).totalAmount).toBe(
			"invalidAmount",
		);
		expect((await fieldErrors({ dailyAmount: "1.12345" })).dailyAmount).toBe(
			"invalidAmount",
		);
	});

	it("requires a currency when a Budget amount is set", async () => {
		expect(
			(await fieldErrors({ currency: "", dailyAmount: "" })).currency,
		).toBe("currencyRequired");
	});
});
