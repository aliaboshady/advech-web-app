import { describe, expect, it, vi } from "vitest";
import { handleFormikError } from "@/lib/utils";
import { TARGETING_ERROR_FIELDS } from "./targeting-error-fields";

function fakeFormik() {
	return { setFieldError: vi.fn() } as never as Parameters<
		typeof handleFormikError
	>[1] & { setFieldError: ReturnType<typeof vi.fn> };
}

describe("targeting error codes", () => {
	it.each([
		["DAYPARTING_AMBIGUOUS", "daypartingKind"],
		["DAYPART_NAME_NOT_ALLOWED", "daypartName"],
		["DAYPART_NAME_WITHOUT_WINDOW", "daypartName"],
		["AGE_RANGE_INVALID", "maxAge"],
		["TIME_ZONE_NOT_AVAILABLE", "timeZoneId"],
		["SCHEDULE_PRESET_NOT_AVAILABLE", "schedulePresetCode"],
		["INTEREST_NOT_AVAILABLE", "interestCodes"],
		["VENUE_TYPE_NOT_AVAILABLE", "venueTypeCodes"],
		["ZONE_ROLE_CONTRADICTION", "zones"],
		["TARGETING_ZONE_NOT_FOUND", "zones"],
	] as const)("maps %s onto %s", (code, field) => {
		const formik = fakeFormik();
		handleFormikError(
			{ code, message: "bad", details: {} },
			formik,
			{},
			TARGETING_ERROR_FIELDS,
		);
		expect(formik.setFieldError).toHaveBeenCalledWith(field, code);
	});
});
