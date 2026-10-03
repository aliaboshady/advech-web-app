import type { TFunction } from "i18next";

export type CampaignStepState = {
	details: boolean;
	targeting: boolean;
	creative: boolean;
};

export type CampaignTab = {
	id: number;
	title: string;
	url: string;
	done: boolean;
	disabled?: boolean;
};

const NO_STEPS_DONE: CampaignStepState = {
	details: false,
	targeting: false,
	creative: false,
};

/**
 * Tab completion for a Campaign, taken from `completeness.steps`.
 * Without a saved Campaign (`disabled`), every tab but the first is locked.
 */
export function getCampaignTabs(
	t: TFunction,
	steps: CampaignStepState = NO_STEPS_DONE,
	disabled = false,
): CampaignTab[] {
	return [
		{
			id: 1,
			title: t("campaigns.tabs.identity"),
			url: "identity",
			done: steps.details,
		},
		{
			id: 2,
			title: t("campaigns.tabs.targeting"),
			url: "targeting",
			done: steps.targeting,
			disabled,
		},
		{
			id: 3,
			title: t("campaigns.tabs.creative"),
			url: "creative",
			done: steps.creative,
			disabled,
		},
		{
			id: 4,
			title: t("campaigns.tabs.review"),
			url: "review",
			done: false,
			disabled,
		},
	];
}
