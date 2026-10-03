import * as Yup from "yup";
import { isRealCalendarDate } from "./build-campaign-details-payload";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 120;
const MONEY_AMOUNT_PATTERN = /^\d{1,15}(\.\d{1,4})?$/;
const OBJECTIVE_CODE_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const CURRENCY_CODE_PATTERN = /^[A-Za-z]{3}$/;

function isBlank(value: string | undefined): boolean {
	return !value?.trim();
}

/** Client-side limits for the Identity step, matching the details contract. */
export const identityValidationSchema = Yup.object({
	name: Yup.string()
		.transform((value: string) => value.trim())
		.required("nameRequired")
		.min(NAME_MIN_LENGTH, "nameMin")
		.max(NAME_MAX_LENGTH, "nameMax"),
	objectiveCode: Yup.string()
		.transform((value: string) => value.trim())
		.required("objectiveRequired")
		.matches(OBJECTIVE_CODE_PATTERN, "objectiveCodeInvalid"),
	startDate: Yup.string().test(
		"startDate",
		"invalidFlightDate",
		(value) => isBlank(value) || isRealCalendarDate(value ?? ""),
	),
	endDate: Yup.string()
		.test(
			"endDate",
			"invalidFlightDate",
			(value) => isBlank(value) || isRealCalendarDate(value ?? ""),
		)
		.test(
			"flightOrder",
			"flightDatesInvalid",
			function validateFlightOrder(endDate) {
				const startDate = this.parent.startDate as string | undefined;
				if (isBlank(startDate) || isBlank(endDate)) {
					return true;
				}
				if (
					!isRealCalendarDate(startDate ?? "") ||
					!isRealCalendarDate(endDate ?? "")
				) {
					return true;
				}
				return (endDate ?? "") >= (startDate ?? "");
			},
		),
	totalAmount: Yup.string().test(
		"totalAmount",
		"invalidAmount",
		(value) => isBlank(value) || MONEY_AMOUNT_PATTERN.test(value?.trim() ?? ""),
	),
	dailyAmount: Yup.string().test(
		"dailyAmount",
		"invalidAmount",
		(value) => isBlank(value) || MONEY_AMOUNT_PATTERN.test(value?.trim() ?? ""),
	),
	currency: Yup.string().test(
		"currency",
		"currencyRequired",
		function validateCurrency(currency) {
			const totalAmount = this.parent.totalAmount as string | undefined;
			const dailyAmount = this.parent.dailyAmount as string | undefined;
			if (isBlank(totalAmount) && isBlank(dailyAmount)) {
				return true;
			}
			return CURRENCY_CODE_PATTERN.test(currency?.trim() ?? "");
		},
	),
});
