import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { LookupItem } from "@/features/lookups/types";
import { Objective } from "@/features/Objectives/types";
import { IdentityForm } from "../components/Forms/IdentityForm";

const tabs = [
	{
		id: 1,
		title: "Identity",
		state: "!",
		url: "identity",
		disabled: true,
	},
	{
		id: 2,
		title: "Targeting",
		state: "!",
		url: "targeting",
		disabled: true,
	},
	{
		id: 3,
		title: "Creative",
		state: "!",
		url: "creative",
		disabled: true,
	},
	{
		id: 4,
		title: "Review",
		state: "!",
		url: "review",
		disabled: true,
	},
];

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
				{ label: t("locale:New") },
			]}
			className="flex flex-col gap-4"
		>
			<HeaderTabs tabs={tabs} activeTabId={1} />
			<IdentityForm
				submitButtonTitle="Create and continue"
				objectives={objectives}
				currencies={currencies}
			/>
		</PageLayout>
	);
}
