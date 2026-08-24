import { type ClassValue, clsx } from "clsx";
import { FormikHelpers } from "formik";
import { twMerge } from "tailwind-merge";
import { ErrorResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isErrorResponse(error: unknown): error is ErrorResponse {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		"message" in error &&
		"details" in error
	);
}

export function handleFormikError<T>(error: unknown, formik: FormikHelpers<T>) {
	if (!isErrorResponse(error)) {
		return;
	}

	for (const detail of error.details) {
		if (detail.field && detail.constraints?.[0]) {
			formik.setFieldError(detail.field, detail.constraints[0]);
		}
	}
}
