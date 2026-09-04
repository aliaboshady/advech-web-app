import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";

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
			Hello "/_private/campaigns/new"!
		</PageLayout>
	);
}
