import { useTranslation } from "react-i18next";
import { CampaignEditableRegion } from "../components/CampaignEditableRegion";
import { CampaignStepLayout } from "../components/CampaignStepLayout";
import { CreativeForm } from "../components/Forms/CreativeForm";
import { Campaign } from "../types";

type Props = {
	id: string;
	campaign: Campaign;
};

export function CampaignCreativePage({ id, campaign }: Props) {
	const { t } = useTranslation();

	return (
		<CampaignStepLayout
			campaign={campaign}
			activeTabId={3}
			description={t("campaigns.creative.description")}
		>
			<CampaignEditableRegion status={campaign.status}>
				<CreativeForm
					campaignId={id}
					creative={campaign.creatives[0] ?? null}
				/>
			</CampaignEditableRegion>
		</CampaignStepLayout>
	);
}
