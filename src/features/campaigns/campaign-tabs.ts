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
};

/** Tab completion for an existing Campaign, taken from `completeness.steps`. */
export function getCampaignTabs(steps: CampaignStepState): CampaignTab[] {
	return [
		{ id: 1, title: "Identity", url: "identity", done: steps.details },
		{ id: 2, title: "Targeting", url: "targeting", done: steps.targeting },
		{ id: 3, title: "Creative", url: "creative", done: steps.creative },
		{ id: 4, title: "Review", url: "review", done: false },
	];
}
