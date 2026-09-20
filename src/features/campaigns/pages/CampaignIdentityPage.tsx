import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { Objective } from "@/features/Objectives/types";
import { IdentityForm } from "../components/Forms/IdentityForm";
import { Campaign } from "../types";

const tabs = [
	{
		id: 1,
		title: "Identity",
		url: "identity",
		done: true,
	},
	{
		id: 2,
		title: "Targeting",
		url: "targeting",
		done: false,
	},
	{
		id: 3,
		title: "Creative",
		url: "creative",
		done: false,
	},
	{
		id: 4,
		title: "Review",
		url: "review",
		done: false,
	},
];

type Props = {
	id: string;
	objectives: Objective[];
	campaign: Campaign;
};

export function CampaignIdentityPage({ id, objectives, campaign }: Props) {
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
			<HeaderTabs url={`/campaigns/${id}`} tabs={tabs} activeTabId={1} />
			<IdentityForm
				submitButtonTitle="Save and continue"
				objectives={objectives}
				campaign={campaign}
			/>
		</PageLayout>
	);
}
