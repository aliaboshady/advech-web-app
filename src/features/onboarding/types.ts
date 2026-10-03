import type { AdvertiserStatus } from "@/features/admin/advertisers/advertiser-summary";

/** `GET /advertiser/onboarding`: the router for an Advertiser's Onboarding. */
export type OnboardingState = {
	status: AdvertiserStatus;
	reviewReason: string | null;
	form: {
		complete: boolean;
		/** Names like `company.telephone`; only the required ones appear. */
		missingFields: string[];
	};
	consent: {
		complete: boolean;
		currentVersion: string;
		acceptedVersion: string | null;
		acceptedAt: string | null;
	};
};

/** One entry of `GET /countries` or `GET /cities`. Submit the `name`, never the `id`. */
export type PlaceOption = {
	id: string;
	name: string;
};
