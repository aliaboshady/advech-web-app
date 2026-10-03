import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCampaignTabs } from "../campaign-tabs";
import { CampaignReviewSummary } from "../components/CampaignReviewSummary";
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
		<PageLayout
			breadcrumbs={[
				{
					label: t("sidebar.campaigns"),
					link: "/campaigns",
				},
				{ label: campaign.name },
			]}
			className="flex flex-col gap-4"
		>
			<HeaderTabs
				url={`/campaigns/${id}`}
				tabs={getCampaignTabs(t, campaign.completeness.steps)}
				activeTabId={4}
			/>
			<CampaignReviewSummary campaign={campaign} />
			{gaps.missing.length > 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>{t("campaigns.review.missingTitle")}</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-2">
							{gaps.missing.map((item) => (
								<li key={item.code}>
									<MissingItem item={item} campaignId={id} />
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
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
					className="text-sm text-muted-foreground"
				>
					{t("campaigns.review.submitUnavailable")}
				</p>
			</div>
		</PageLayout>
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
	const className = "text-primary underline-offset-4 hover:underline";
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
