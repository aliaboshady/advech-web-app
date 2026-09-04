import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";

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
};

export function CampaignIdentityPage({ id }: Props) {
	const { t } = useTranslation();

	return (
		<PageLayout
			breadcrumbs={[
				{
					label: t("sidebar.campaigns"),
					link: "/campaigns",
				},
				{ label: id },
			]}
			className="flex flex-col gap-4"
		>
			<HeaderTabs url={`/campaigns/${id}`} tabs={tabs} activeTabId={1} />
			Hello "/_private/campaigns/{id}"!
		</PageLayout>
	);
}
