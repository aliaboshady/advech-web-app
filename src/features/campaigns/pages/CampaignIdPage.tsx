import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";

type Props = {
	id: string;
};

export function CampaignIdPage({ id }: Props) {
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
			Hello "/_private/campaigns/{id}"!
		</PageLayout>
	);
}
