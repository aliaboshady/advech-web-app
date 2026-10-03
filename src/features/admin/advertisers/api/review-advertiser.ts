import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { AdvertiserDetail } from "../advertiser-detail";
import { ReviewAction } from "../offered-review-actions";

export const ADVERTISER_INVALID_STATUS_TRANSITION =
	"ADVERTISER_INVALID_STATUS_TRANSITION";

const ACTION_SUFFIX: Record<ReviewAction, string> = {
	approve: "approve",
	reject: "reject",
	requestChanges: "request-changes",
	suspend: "suspend",
	unsuspend: "unsuspend",
};

export type ReviewAdvertiserInput = {
	readonly id: string;
	readonly action: ReviewAction;
	readonly reason?: string;
};

function reviewBody(input: ReviewAdvertiserInput): string | undefined {
	if (input.action !== "reject" && input.action !== "requestChanges") {
		return undefined;
	}
	return JSON.stringify({ reason: input.reason ?? "" });
}

/** Applies one Review action and returns the Advertiser's updated detail. */
export async function reviewAdvertiser(
	input: ReviewAdvertiserInput,
): Promise<ServerResponse<AdvertiserDetail>> {
	const body = reviewBody(input);
	return apiClient<ServerResponse<AdvertiserDetail>>(
		`admin/advertisers/${encodeURIComponent(input.id)}/${ACTION_SUFFIX[input.action]}`,
		{
			method: "POST",
			...(body === undefined ? {} : { body }),
		},
	);
}
