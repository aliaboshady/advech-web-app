import { describe, expect, it } from "vitest";
import { ValidationError } from "yup";
import { targetingValidationSchema } from "./targeting-validation";

const validTargeting = {
	timeZoneId: "Africa/Cairo",
	daypartingEdited: false,
	daypartingKind: "",
	schedulePresetCode: "",
	days: [] as number[],
	startTime: "",
	endTime: "",
	daypartName: "",
	minAge: "18",
	maxAge: "35",
	interestsEdited: false,
	interestCodes: [] as string[],
	venueTypesEdited: false,
	venueTypeCodes: [] as string[],
	inclusionZoneIds: [] as string[],
	exclusionZoneIds: [] as string[],
	carsCount: "2",
	deliveryMode: "MOVING",
};

async function fieldErrors(
	values: Partial<typeof validTargeting>,
): Promise<Record<string, string>> {
	try {
		await targetingValidationSchema.validate(
			{ ...validTargeting, ...values },
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

describe("targeting validation", () => {
	it("accepts an age range from 13 to 99", async () => {
		await expect(
			targetingValidationSchema.validate({
				...validTargeting,
				minAge: "13",
				maxAge: "99",
			}),
		).resolves.toBeTruthy();
	});

	it("rejects an age outside 13 to 99", async () => {
		expect((await fieldErrors({ minAge: "12" })).minAge).toBe("ageOutOfRange");
		expect((await fieldErrors({ maxAge: "100" })).maxAge).toBe("ageOutOfRange");
	});

	it("rejects an age range that ends before it starts", async () => {
		expect((await fieldErrors({ minAge: "40", maxAge: "18" })).maxAge).toBe(
			"ageRangeInvalid",
		);
	});

	it("allows an empty age range and an age with only one end set", async () => {
		expect(await fieldErrors({ minAge: "", maxAge: "" })).toEqual({});
		expect(await fieldErrors({ minAge: "21", maxAge: "" })).toEqual({});
	});

	it("rejects a Zone that is both included and excluded", async () => {
		expect(
			(
				await fieldErrors({
					inclusionZoneIds: ["zone-downtown"],
					exclusionZoneIds: ["zone-downtown"],
				})
			).exclusionZoneIds,
		).toBe("zoneRoleContradiction");
	});

	it("allows the same library when each Zone is on only one side", async () => {
		expect(
			await fieldErrors({
				inclusionZoneIds: ["zone-downtown"],
				exclusionZoneIds: ["zone-airport"],
			}),
		).toEqual({});
	});
});
