import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";

/**
 * Destination for a queue row.
 * Company, contact and Review actions are the next ticket.
 */
export function AdvertiserDetailPage() {
	const { t } = useTranslation();
	return (
		<PageLayout title={t("admin.advertisers.detail.title")}>{null}</PageLayout>
	);
}
