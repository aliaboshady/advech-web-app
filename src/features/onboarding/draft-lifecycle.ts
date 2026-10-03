import type { AdvertiserStatus } from "@/features/admin/advertisers/advertiser-summary";
import { clearDraft, type StorageLike } from "./onboarding-draft";

/**
 * Once an Advertiser is approved the form is done with, and once it is
 * rejected nothing can be resubmitted. Every other status may still need the
 * typed values (a `NEEDS_CHANGES` Advertiser is prefilled from them).
 * Logout clears the draft too, but that is the logout's own job.
 */
export function shouldClearDraft(status: AdvertiserStatus): boolean {
	return status === "APPROVED" || status === "REJECTED";
}

export function clearDraftWhenDone(
	storage: StorageLike,
	userId: string,
	status: AdvertiserStatus,
): void {
	if (shouldClearDraft(status)) {
		clearDraft(storage, userId);
	}
}
