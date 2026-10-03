export type CampaignWizardStep = "identity" | "targeting" | "creative";

export type MissingLabelKey =
	| "campaigns.review.missing.name"
	| "campaigns.review.missing.objective"
	| "campaigns.review.missing.flight"
	| "campaigns.review.missing.totalBudget"
	| "campaigns.review.missing.timeZone"
	| "campaigns.review.missing.dayparting"
	| "campaigns.review.missing.inclusionZone"
	| "campaigns.review.missing.creative"
	| "campaigns.review.missing.singleCreative";

export type MissingRequirementItem = {
	code: string;
	labelKey: MissingLabelKey | null;
	step: CampaignWizardStep | null;
	href: string | null;
};

export type CampaignReviewGaps = {
	missing: MissingRequirementItem[];
	submit: {
		readonly isDisabled: true;
	};
};

type Requirement = {
	step: CampaignWizardStep;
	labelKey: MissingLabelKey;
};

const REQUIREMENTS: Record<string, Requirement> = {
	name: { step: "identity", labelKey: "campaigns.review.missing.name" },
	objective: {
		step: "identity",
		labelKey: "campaigns.review.missing.objective",
	},
	flight: { step: "identity", labelKey: "campaigns.review.missing.flight" },
	totalBudget: {
		step: "identity",
		labelKey: "campaigns.review.missing.totalBudget",
	},
	timeZone: {
		step: "targeting",
		labelKey: "campaigns.review.missing.timeZone",
	},
	dayparting: {
		step: "targeting",
		labelKey: "campaigns.review.missing.dayparting",
	},
	inclusionZone: {
		step: "targeting",
		labelKey: "campaigns.review.missing.inclusionZone",
	},
	creative: { step: "creative", labelKey: "campaigns.review.missing.creative" },
	singleCreative: {
		step: "creative",
		labelKey: "campaigns.review.missing.singleCreative",
	},
};

type BuildCampaignReviewGapsInput = {
	campaignId: string;
	missing: readonly string[];
};

/** Maps Completeness gaps to the wizard step that fills each one. Submit stays off. */
export function buildCampaignReviewGaps(
	input: BuildCampaignReviewGapsInput,
): CampaignReviewGaps {
	return {
		missing: input.missing.map((code) => toMissingItem(input.campaignId, code)),
		submit: { isDisabled: true },
	};
}

function toMissingItem(
	campaignId: string,
	code: string,
): MissingRequirementItem {
	const requirement = REQUIREMENTS[code];
	if (!requirement) {
		return { code, labelKey: null, step: null, href: null };
	}
	return {
		code,
		labelKey: requirement.labelKey,
		step: requirement.step,
		href: `/campaigns/${campaignId}/${requirement.step}`,
	};
}
