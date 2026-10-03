import { AdvertiserStatus } from "./advertiser-summary";

/** Company facts an Admin checks before a Review decision. */
export type AdvertiserCompany = {
	readonly name: string | null;
	readonly email: string | null;
	readonly country: string | null;
	readonly city: string | null;
	readonly telephone: string | null;
	readonly address: string | null;
};

/** Person an Admin can reach about the Advertiser. */
export type AdvertiserContact = {
	readonly firstName: string | null;
	readonly lastName: string | null;
	readonly mobile: string | null;
	readonly title: string | null;
};

/** Whether the Advertiser has accepted the current terms. */
export type AdvertiserConsent = {
	readonly complete: boolean;
	readonly currentVersion: string;
	readonly acceptedVersion: string | null;
	readonly acceptedAt: string | null;
};

/** One Advertiser as returned by the Review detail and action endpoints. */
export type AdvertiserDetail = {
	readonly id: string;
	readonly status: AdvertiserStatus;
	readonly reviewReason: string | null;
	readonly ownerEmail: string | null;
	readonly company: AdvertiserCompany;
	readonly contact: AdvertiserContact;
	readonly consent: AdvertiserConsent;
	readonly createdAt: string;
	readonly updatedAt: string;
};
