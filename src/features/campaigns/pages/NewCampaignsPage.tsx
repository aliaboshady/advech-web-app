import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";

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

export function NewCampaignPage() {
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
			Hello "/_private/campaigns/new"!
		</PageLayout>
	);
}
