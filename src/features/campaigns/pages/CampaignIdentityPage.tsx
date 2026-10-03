import { useTranslation } from "react-i18next";
import { LookupItem } from "@/features/lookups/types";
import { Objective } from "@/features/Objectives/types";
import { CampaignEditableRegion } from "../components/CampaignEditableRegion";
import { CampaignStepLayout } from "../components/CampaignStepLayout";
import { IdentityForm } from "../components/Forms/IdentityForm";
import { Campaign } from "../types";

type Props = {
	id: string;
	objectives: Objective[];
	currencies: LookupItem[];
	campaign: Campaign;
};

export function CampaignIdentityPage({
	objectives,
	currencies,
	campaign,
}: Props) {
	const { t } = useTranslation();
	return (
		<CampaignStepLayout
			campaign={campaign}
			activeTabId={1}
			description={t("campaigns.identity.description")}
		>
			<CampaignEditableRegion status={campaign.status}>
				<IdentityForm
					submitButtonTitle={t("campaigns.identity.saveAndContinue")}
					objectives={objectives}
					currencies={currencies}
					campaign={campaign}
				/>
			</CampaignEditableRegion>
		</CampaignStepLayout>
	);
}
