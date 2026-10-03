import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { LookupItem } from "@/features/lookups/types";
import { Objective } from "@/features/Objectives/types";
import { getCampaignTabs } from "../campaign-tabs";
import { IdentityForm } from "../components/Forms/IdentityForm";

type Props = {
	objectives: Objective[];
	currencies: LookupItem[];
};

export function NewCampaignPage({ objectives, currencies }: Props) {
	const { t } = useTranslation();

	return (
		<PageLayout
			breadcrumbs={[
				{
					label: t("sidebar.campaigns"),
					link: "/campaigns",
				},
				{ label: t("campaigns.new.breadcrumb") },
			]}
			title={t("campaigns.new.title")}
			description={t("campaigns.new.description")}
			className="gap-section"
		>
			<HeaderTabs tabs={getCampaignTabs(t, undefined, true)} activeTabId={1} />
			<IdentityForm
				submitButtonTitle={t("campaigns.identity.createAndContinue")}
				objectives={objectives}
				currencies={currencies}
			/>
		</PageLayout>
	);
}
