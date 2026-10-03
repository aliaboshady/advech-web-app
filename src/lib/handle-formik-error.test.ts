import { describe, expect, it, vi } from "vitest";
import { handleFormikError } from "./utils";

function fakeFormik() {
	return { setFieldError: vi.fn() } as never as Parameters<
		typeof handleFormikError
	>[1] & { setFieldError: ReturnType<typeof vi.fn> };
}

describe("handleFormikError", () => {
	it("maps array details onto fields", () => {
		const formik = fakeFormik();
		handleFormikError(
			{
				code: "VALIDATION",
				message: "bad",
				details: [{ field: "name", constraints: ["nameMin"] }],
			},
			formik,
		);
		expect(formik.setFieldError).toHaveBeenCalledWith("name", "nameMin");
	});

	it("maps a domain error code onto its field when details is an object", () => {
		const formik = fakeFormik();
		handleFormikError(
			{ code: "FLIGHT_DATES_INVALID", message: "bad", details: {} },
			formik,
			{},
			{ FLIGHT_DATES_INVALID: "endDate" },
		);
		expect(formik.setFieldError).toHaveBeenCalledWith(
			"endDate",
			"FLIGHT_DATES_INVALID",
		);
	});

	it("ignores domain errors with no field mapping", () => {
		const formik = fakeFormik();
		handleFormikError({ code: "OTHER", message: "x", details: {} }, formik);
		expect(formik.setFieldError).not.toHaveBeenCalled();
	});
});
