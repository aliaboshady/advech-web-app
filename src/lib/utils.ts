import { type ClassValue, clsx } from "clsx";
import { FormikHelpers } from "formik";
import { DateTime } from "luxon";
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

export function getUserInitials(
	firstName?: string | null,
	lastName?: string | null,
	email?: string | null,
): string {
	if (firstName && lastName) {
		return `${firstName[0]}${lastName[0]}`.toUpperCase();
	}

	if (firstName) {
		return firstName[0].toUpperCase();
	}

	if (email) {
		return email[0].toUpperCase();
	}

	return "";
}

export function formatDate(
	date: string,
	mode: "dateTime" | "date" | "time" = "dateTime",
): string {
	if (!date) return "";
	let format = "dd MMM yyyy, hh:mm a";

	if (mode === "date") format = "dd MMM yyyy";
	else if (mode === "time") format = "hh:mm a";
	return DateTime.fromISO(date).toFormat(format);
}

export function getStatusColor(status: string) {
	switch (status) {
		case "Active":
			return "bg-emerald-600";
		case "Scheduled":
			return "bg-sky-600";
		case "Paused":
			return "bg-amber-600";
		case "Completed":
			return "bg-slate-600";
		case "Cancelled":
			return "bg-rose-600";
		default:
			return "bg-slate-600";
	}
}
