import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FormSectionCard } from "@/components/FormSectionCard";
import { Button } from "@/components/ui/button";
import { CampaignReviewSummary } from "../components/CampaignReviewSummary";
import { CampaignStepLayout } from "../components/CampaignStepLayout";
import {
	buildCampaignReviewGaps,
	type CampaignWizardStep,
	type MissingRequirementItem,
} from "../review-gaps";
import type { Campaign } from "../types";

type Props = {
	id: string;
	campaign: Campaign;
};

export function CampaignReviewPage({ id, campaign }: Props) {
	const { t } = useTranslation();
	const gaps = buildCampaignReviewGaps({
		campaignId: id,
		missing: campaign.completeness.missing,
	});
	return (
		<CampaignStepLayout
			campaign={campaign}
			activeTabId={4}
			description={t("campaigns.review.description")}
		>
			<CampaignReviewSummary campaign={campaign} />
			{gaps.missing.length > 0 ? (
				<FormSectionCard title={t("campaigns.review.missingTitle")}>
					<ul className="flex flex-col gap-2 @md/formSection:col-span-2">
						{gaps.missing.map((item) => (
							<li key={item.code} className="text-body-md">
								<MissingItem item={item} campaignId={id} />
							</li>
						))}
					</ul>
				</FormSectionCard>
			) : null}
			<div className="flex flex-col items-end gap-2">
				<Button
					type="button"
					disabled={gaps.submit.isDisabled}
					aria-describedby="campaign-review-submit-note"
				>
					{t("campaigns.review.submit")}
				</Button>
				<p
					id="campaign-review-submit-note"
					className="text-body-md text-muted-foreground"
				>
					{t("campaigns.review.submitUnavailable")}
				</p>
			</div>
		</CampaignStepLayout>
	);
}

function MissingItem({
	item,
	campaignId,
}: {
	item: MissingRequirementItem;
	campaignId: string;
}) {
	const { t } = useTranslation();
	const label = item.labelKey
		? t(item.labelKey)
		: t("campaigns.review.missingUnknown", { code: item.code });
	if (!item.step) {
		return <span>{label}</span>;
	}
	return (
		<StepLink campaignId={campaignId} step={item.step}>
			{label}
		</StepLink>
	);
}

function StepLink({
	campaignId,
	step,
	children,
}: {
	campaignId: string;
	step: CampaignWizardStep;
	children: ReactNode;
}) {
	const className =
		"text-foreground underline underline-offset-4 hover:text-muted-foreground";
	if (step === "identity") {
		return (
			<Link
				to="/campaigns/$id/identity"
				params={{ id: campaignId }}
				className={className}
			>
				{children}
			</Link>
		);
	}
	if (step === "targeting") {
		return (
			<Link
				to="/campaigns/$id/targeting"
				params={{ id: campaignId }}
				className={className}
			>
				{children}
			</Link>
		);
	}
	return (
		<Link
			to="/campaigns/$id/creative"
			params={{ id: campaignId }}
			className={className}
		>
			{children}
		</Link>
	);
}
