import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { LookupItem } from "@/features/lookups/types";
import { Objective } from "@/features/Objectives/types";
import { getCampaignTabs } from "../campaign-tabs";
import { CampaignEditableRegion } from "../components/CampaignEditableRegion";
import { IdentityForm } from "../components/Forms/IdentityForm";
import { Campaign } from "../types";

type Props = {
	id: string;
	objectives: Objective[];
	currencies: LookupItem[];
	campaign: Campaign;
};

export function CampaignIdentityPage({
	id,
	objectives,
	currencies,
	campaign,
}: Props) {
	const { t } = useTranslation();
	return (
		<PageLayout
			breadcrumbs={[
				{
					label: t("sidebar.campaigns"),
					link: "/campaigns",
				},
				{ label: campaign?.name },
			]}
			className="flex flex-col gap-4"
		>
			<HeaderTabs
				url={`/campaigns/${id}`}
				tabs={getCampaignTabs(campaign.completeness.steps)}
				activeTabId={1}
			/>
			<CampaignEditableRegion status={campaign.status}>
				<IdentityForm
					submitButtonTitle="Save and continue"
					objectives={objectives}
					currencies={currencies}
					campaign={campaign}
				/>
			</CampaignEditableRegion>
		</PageLayout>
	);
}
