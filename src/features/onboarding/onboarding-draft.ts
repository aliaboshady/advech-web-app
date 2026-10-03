import {
	BLANK_COMPANY,
	BLANK_CONTACT,
	type OnboardingSection,
	type SectionValues,
} from "./form-values";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** What the user typed, per section. Only whitelisted text fields are ever stored. */
export type OnboardingDraft = {
	[S in OnboardingSection]?: Partial<SectionValues[S]>;
};

const KEYS: Record<OnboardingSection, readonly string[]> = {
	company: Object.keys(BLANK_COMPANY),
	contact: Object.keys(BLANK_CONTACT),
};

export function draftKey(userId: string): string {
	return `advech.onboarding-draft.${userId}`;
}

function sanitizeSection(
	section: OnboardingSection,
	raw: unknown,
): Record<string, string> | undefined {
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
		return undefined;
	}
	const clean: Record<string, string> = {};
	for (const key of KEYS[section]) {
		const value = (raw as Record<string, unknown>)[key];
		if (typeof value === "string") {
			clean[key] = value;
		}
	}
	return Object.keys(clean).length > 0 ? clean : undefined;
}

/** The user's saved draft, or an empty one when there is none or it is unreadable. */
export function loadDraft(
	storage: StorageLike,
	userId: string,
): OnboardingDraft {
	try {
		const raw = storage.getItem(draftKey(userId));
		if (raw === null) {
			return {};
		}
		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== "object" || parsed === null) {
			return {};
		}
		const draft: OnboardingDraft = {};
		for (const section of ["company", "contact"] as const) {
			const clean = sanitizeSection(
				section,
				(parsed as Record<string, unknown>)[section],
			);
			if (clean !== undefined) {
				draft[section] = clean;
			}
		}
		return draft;
	} catch {
		return {};
	}
}

/** Stores one section's values and keeps the other section as it was. */
export function saveDraftSection<S extends OnboardingSection>(
	storage: StorageLike,
	userId: string,
	section: S,
	values: SectionValues[S],
): void {
	try {
		const draft: OnboardingDraft = loadDraft(storage, userId);
		draft[section] = sanitizeSection(section, values) as Partial<
			SectionValues[S]
		>;
		storage.setItem(draftKey(userId), JSON.stringify(draft));
	} catch {
		// A full or blocked storage only costs the refresh-restore.
	}
}

export function clearDraft(storage: StorageLike, userId: string): void {
	try {
		storage.removeItem(draftKey(userId));
	} catch {
		// Nothing to clear if storage is blocked.
	}
}
