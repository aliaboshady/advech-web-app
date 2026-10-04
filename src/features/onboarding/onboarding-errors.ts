const NOT_APPROVED = "ADVERTISER_NOT_APPROVED";
const FORM_LOCKED = "ADVERTISER_FORM_LOCKED";

/** A product API refused because the Advertiser is not `APPROVED` (any more). */
export function isNotApproved(error: { readonly code: string }): boolean {
	return error.code === NOT_APPROVED;
}

/** The Onboarding form was saved while its status locks it. */
export function isFormLocked(error: { readonly code: string }): boolean {
	return error.code === FORM_LOCKED;
}
