import type { AdvertiserStatus } from "@/features/admin/advertisers/advertiser-summary";
import type { CampaignStatus } from "@/features/campaigns/types";

export type StatusToken =
	| "success"
	| "warning"
	| "info"
	| "destructive"
	| "neutral";
/** Filled reads as final; soft reads as in-flight or recoverable. */
export type StatusTone = "filled" | "soft";
export type StatusIcon =
	| "check"
	| "clock"
	| "alert"
	| "x"
	| "ban"
	| "radio"
	| "pause";

export type StatusVisual = {
	readonly token: StatusToken;
	readonly tone: StatusTone;
	readonly labelKey:
		| `admin.advertisers.statuses.${AdvertiserStatus}`
		| `campaigns.statuses.${CampaignStatus}`;
	readonly icon?: StatusIcon;
};

export type StatusKind = "advertiser" | "campaign";
export type StatusOf<K extends StatusKind> = K extends "advertiser"
	? AdvertiserStatus
	: CampaignStatus;

type Shape = Omit<StatusVisual, "labelKey">;

const SHARED = {
	PENDING_REVIEW: { token: "info", tone: "soft", icon: "clock" },
	NEEDS_CHANGES: { token: "warning", tone: "soft", icon: "alert" },
	APPROVED: { token: "success", tone: "soft", icon: "check" },
	REJECTED: { token: "destructive", tone: "filled", icon: "x" },
} as const satisfies Record<string, Shape>;

// Record over the status unions: a new backend status fails typecheck until mapped.
const ADVERTISER_SHAPES: Record<AdvertiserStatus, Shape> = {
	...SHARED,
	REGISTERED: { token: "neutral", tone: "soft" },
	IN_PROGRESS: { token: "warning", tone: "soft" },
	SUSPENDED: { token: "destructive", tone: "soft", icon: "ban" },
};

const CAMPAIGN_SHAPES: Record<CampaignStatus, Shape> = {
	...SHARED,
	DRAFT: { token: "neutral", tone: "soft" },
	SCHEDULED: { token: "info", tone: "soft" },
	LIVE: { token: "success", tone: "filled", icon: "radio" },
	COMPLETED: { token: "neutral", tone: "soft" },
	PAUSED: { token: "warning", tone: "soft", icon: "pause" },
	ARCHIVED: { token: "neutral", tone: "soft" },
};

export function statusVisual<K extends StatusKind>(
	kind: K,
	status: StatusOf<K>,
): StatusVisual {
	if (kind === "advertiser") {
		return {
			...ADVERTISER_SHAPES[status as AdvertiserStatus],
			labelKey: `admin.advertisers.statuses.${status as AdvertiserStatus}`,
		};
	}
	return {
		...CAMPAIGN_SHAPES[status as CampaignStatus],
		labelKey: `campaigns.statuses.${status as CampaignStatus}`,
	};
}
