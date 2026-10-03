import { AdvertiserStatus } from "./advertiser-summary";

/** Rows an Admin must act on stand out in the Review queue. */
export function isProminentQueueRow(status: AdvertiserStatus): boolean {
	return status === "PENDING_REVIEW";
}
