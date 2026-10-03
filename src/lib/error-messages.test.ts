import { FormikHelpers } from "formik";
import { describe, expect, it, vi } from "vitest";
import { resolveErrorMessage } from "./error-messages";
import { handleFormikError } from "./utils";

describe("resolveErrorMessage", () => {
	it("maps Flight, currency and editability codes to their messages", () => {
		expect(
			resolveErrorMessage(
				{ code: "FLIGHT_DATES_INVALID", message: "from the server" },
				"en",
			),
		).toBe("The Flight must end on or after it starts");
		expect(
			resolveErrorMessage(
				{ code: "CURRENCY_NOT_ACCEPTED", message: "from the server" },
				"en",
			),
		).toBe("That currency is not accepted");
		expect(
			resolveErrorMessage(
				{ code: "MONEY_PRECISION_EXCEEDED", message: "from the server" },
				"en",
			),
		).toBe("The amount has more decimal places than the currency allows");
		expect(
			resolveErrorMessage(
				{ code: "CAMPAIGN_NOT_EDITABLE", message: "from the server" },
				"en",
			),
		).toBe(
			"A Campaign can only be changed while it is a draft or has been returned for changes",
		);
	});

	it("maps Creative upload codes to their messages", () => {
		expect(
			resolveErrorMessage(
				{ code: "CREATIVE_TOO_LARGE", message: "from the server" },
				"en",
			),
		).toBe("That file is larger than the maximum for its type");
		expect(
			resolveErrorMessage(
				{ code: "CREATIVE_OBJECT_MISSING", message: "from the server" },
				"en",
			),
		).toBe("Upload the file before confirming it");
		expect(
			resolveErrorMessage(
				{ code: "CREATIVE_ALREADY_CONFIRMED", message: "from the server" },
				"en",
			),
		).toBe("This Creative has already been confirmed");
		expect(
			resolveErrorMessage(
				{ code: "CREATIVE_LIMIT_REACHED", message: "from the server" },
				"en",
			),
		).toBe("This Campaign already holds the maximum number of Creatives");
		expect(
			resolveErrorMessage(
				{ code: "CREATIVE_DURATION_NOT_ALLOWED", message: "from the server" },
				"en",
			),
		).toBe("A still image has no duration");
		expect(
			resolveErrorMessage(
				{ code: "CREATIVE_NOT_FOUND", message: "from the server" },
				"en",
			),
		).toBe("Creative not found");
	});

	it("maps admin sign-in and permission-denied codes to their messages", () => {
		expect(
			resolveErrorMessage(
				{ code: "ADMIN_INVALID_CREDENTIALS", message: "from the server" },
				"en",
			),
		).toBe("That email or password is wrong");
		expect(
			resolveErrorMessage(
				{ code: "USER_SUSPENDED", message: "from the server" },
				"en",
			),
		).toBe("This account is suspended. Contact another Admin");
		expect(
			resolveErrorMessage(
				{ code: "PERMISSION_DENIED", message: "from the server" },
				"en",
			),
		).toBe("You do not have access to this");
		expect(
			resolveErrorMessage(
				{ code: "LOOKUP_CODE_TAKEN", message: "from the server" },
				"en",
			),
		).toBe("That code is already used");
		expect(
			resolveErrorMessage(
				{ code: "LOOKUP_NOT_FOUND", message: "from the server" },
				"en",
			),
		).toBe("That entry no longer exists");
		expect(
			resolveErrorMessage(
				{ code: "LOOKUP_CODE_TAKEN", message: "from the server" },
				"ar",
			),
		).toBe("هذا الرمز مستخدم بالفعل");
		expect(
			resolveErrorMessage(
				{ code: "ADMIN_ALREADY_ACTIVE", message: "from the server" },
				"en",
			),
		).toBe("This person is already an active Admin");
	});

	it("maps an invalid Advertiser status transition to a clear message", () => {
		expect(
			resolveErrorMessage(
				{
					code: "ADVERTISER_INVALID_STATUS_TRANSITION",
					message: "from the server",
				},
				"en",
			),
		).toBe(
			"This Advertiser's status changed, so that action is no longer available",
		);
		expect(
			resolveErrorMessage(
				{
					code: "ADVERTISER_INVALID_STATUS_TRANSITION",
					message: "from the server",
				},
				"ar",
			),
		).toBe("تغيّرت حالة هذا المعلن، لذلك لم يعد هذا الإجراء متاحاً");
	});

	it("keeps the server message when the code is unknown", () => {
		expect(
			resolveErrorMessage(
				{ code: "NOT_A_CAMPAIGN_CODE", message: "Something else failed" },
				"en",
			),
		).toBe("Something else failed");
	});
});

describe("handleFormikError", () => {
	function formikStub(): FormikHelpers<Record<string, string>> & {
		setFieldError: ReturnType<typeof vi.fn>;
	} {
		const setFieldError = vi.fn();
		return { setFieldError } as unknown as FormikHelpers<
			Record<string, string>
		> & {
			setFieldError: ReturnType<typeof vi.fn>;
		};
	}

	it("sets a field error from validation details", () => {
		const formik = formikStub();
		handleFormikError(
			{
				code: "VALIDATION_ERROR",
				message: "Request validation failed",
				details: [
					{
						field: "name",
						constraints: ["name must be longer than or equal to 3 characters"],
					},
				],
			},
			formik,
		);
		expect(formik.setFieldError).toHaveBeenCalledWith(
			"name",
			"name must be longer than or equal to 3 characters",
		);
	});

	it("accepts domain details that are an object", () => {
		const formik = formikStub();
		expect(() =>
			handleFormikError(
				{
					code: "CAMPAIGN_NOT_EDITABLE",
					message:
						"A Campaign can only be changed while it is a draft or has been returned for changes",
					details: { status: "LIVE" },
				},
				formik,
			),
		).not.toThrow();
		expect(formik.setFieldError).not.toHaveBeenCalled();
	});

	it("renames a detail field onto the form field that displays it", () => {
		const formik = formikStub();
		handleFormikError(
			{
				code: "VALIDATION_ERROR",
				message: "Request validation failed",
				details: [
					{
						field: "totalBudget.amount",
						constraints: [
							"amount must be a non-negative decimal string with at most 4 fractional digits",
						],
					},
				],
			},
			formik,
			{ "totalBudget.amount": "totalAmount" },
		);
		expect(formik.setFieldError).toHaveBeenCalledWith(
			"totalAmount",
			"amount must be a non-negative decimal string with at most 4 fractional digits",
		);
	});
});
