import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { getCampaignTabs } from "../campaign-tabs";
import type { Campaign } from "../types";

type Props = {
	campaign: Campaign;
	/** 1 Identity, 2 Targeting, 3 Creative, 4 Review. */
	activeTabId: number;
	description: string;
	children: ReactNode;
};

/**
 * Frame of one step of a saved Campaign: breadcrumbs, Campaign name as the title, its
 * status badge, the step tabs (driven by Completeness) and the step body.
 */
export function CampaignStepLayout({
	campaign,
	activeTabId,
	description,
	children,
}: Props) {
	const { t } = useTranslation();
	const tabs = getCampaignTabs(t, campaign.completeness.steps);
	const stepTitle = tabs.find((tab) => tab.id === activeTabId)?.title ?? "";
	return (
		<PageLayout
			breadcrumbs={[
				{ label: t("sidebar.campaigns"), link: "/campaigns" },
				{ label: stepTitle },
			]}
			title={campaign.name}
			description={description}
			actions={<StatusBadge kind="campaign" status={campaign.status} />}
			className="gap-section"
		>
			<HeaderTabs
				url={`/campaigns/${campaign.id}`}
				tabs={tabs}
				activeTabId={activeTabId}
			/>
			{children}
		</PageLayout>
	);
}
