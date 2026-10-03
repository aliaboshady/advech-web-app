import type { OnboardingSection } from "./form-values";

export type SectionCompleteness = {
	readonly complete: boolean;
	/** The server's names for what is still empty, e.g. `company.telephone`. */
	readonly missing: string[];
};

/**
 * Turns the server's `missingFields` into one completeness per card.
 * The server reports progress; the typed values never come back from it.
 */
export function sectionCompleteness(
	missingFields: readonly string[],
): Record<OnboardingSection, SectionCompleteness> {
	const result = {} as Record<OnboardingSection, SectionCompleteness>;
	for (const section of ["company", "contact"] as const) {
		const missing = missingFields.filter((name) =>
			name.startsWith(`${section}.`),
		);
		result[section] = { complete: missing.length === 0, missing };
	}
	return result;
}
