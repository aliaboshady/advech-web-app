import { lookupCodeIssue } from "./lookup-code";

const SORT_ORDER_MAX = 100000;
const WHOLE_NUMBER = /^(0|[1-9]\d*)$/;

export type LookupFormValues = {
	readonly code: string;
	readonly name: string;
	readonly description: string;
	readonly sortOrder: string;
};

export type CreateLookupBody = {
	readonly code: string;
	readonly name: string;
	readonly description?: string;
	readonly sortOrder?: number;
};

export type UpdateLookupBody = {
	readonly name: string;
	readonly description: string;
	readonly sortOrder?: number;
};

function parseSortOrder(value: string): number | undefined {
	const trimmed = value.trim();
	if (!WHOLE_NUMBER.test(trimmed)) {
		return undefined;
	}
	const parsed = Number(trimmed);
	if (parsed > SORT_ORDER_MAX) {
		return undefined;
	}
	return parsed;
}

/**
 * Body for creating a Lookup entry.
 * Returns null when the code is not 2 to 64 lowercase letters, digits,
 * hyphens or underscores, so that code is not sent.
 */
export function buildCreateLookupBody(
	values: LookupFormValues,
): CreateLookupBody | null {
	const code = values.code.trim();
	if (lookupCodeIssue(code) !== null) {
		return null;
	}
	const description = values.description.trim();
	const sortOrder = parseSortOrder(values.sortOrder);
	return {
		code,
		name: values.name.trim(),
		...(description ? { description } : {}),
		...(sortOrder !== undefined ? { sortOrder } : {}),
	};
}

/**
 * Body for editing a Lookup entry.
 * The code stays fixed after creation, and activation is its own request,
 * so neither `code` nor the active flag is included.
 */
export function buildUpdateLookupBody(
	values: LookupFormValues,
): UpdateLookupBody {
	const sortOrder = parseSortOrder(values.sortOrder);
	return {
		name: values.name.trim(),
		description: values.description.trim(),
		...(sortOrder !== undefined ? { sortOrder } : {}),
	};
}
