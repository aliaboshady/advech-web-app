import { useEffect } from "react";
import type { OnboardingSection, SectionValues } from "./form-values";
import { saveDraftSection } from "./onboarding-draft";

export const DRAFT_DEBOUNCE_MS = 300;

/**
 * Writes a section's values to the local draft shortly after the user stops
 * typing. Only runs once the values differ from where the form started, so an
 * untouched form never overwrites an earlier draft.
 */
export function useDraftAutosave<S extends OnboardingSection>(
	userId: string,
	section: S,
	values: SectionValues[S],
	changed: boolean,
): void {
	useEffect(() => {
		if (!changed || userId === "") {
			return;
		}
		const timer = window.setTimeout(() => {
			saveDraftSection(window.localStorage, userId, section, values);
		}, DRAFT_DEBOUNCE_MS);
		return () => window.clearTimeout(timer);
	}, [userId, section, values, changed]);
}
