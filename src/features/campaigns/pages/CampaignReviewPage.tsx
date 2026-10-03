import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { getCampaignTabs } from "../campaign-tabs";
import { CampaignEditableRegion } from "../components/CampaignEditableRegion";
import { Campaign } from "../types";

type Props = {
	id: string;
	campaign: Campaign;
};

export function CampaignReviewPage({ id, campaign }: Props) {
	const { t } = useTranslation();

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
			<CampaignEditableRegion status={campaign.status}>
				Hello "/_private/campaigns/{id}"!
			</CampaignEditableRegion>
		</PageLayout>
	);
}
