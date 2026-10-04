/**
 * The Advertiser terms copy this build can show, by version.
 * There is no terms-document endpoint, so the client only ever shows text it
 * ships. A version is turned into a key segment with `_` for `.`, because a
 * dot would read as a nesting separator in an i18n key.
 * TODO: replace the placeholder copy once the real terms exist.
 */
const KNOWN_TERMS = {
	"1.0": { copyKey: "onboarding.terms.v1_0" },
} as const;

export type TermsCopy = (typeof KNOWN_TERMS)[keyof typeof KNOWN_TERMS];

/** The copy for the version the server names as current, or null if this build has none. */
export function resolveTermsCopy(version: string): TermsCopy | null {
	return Object.hasOwn(KNOWN_TERMS, version)
		? KNOWN_TERMS[version as keyof typeof KNOWN_TERMS]
		: null;
}
