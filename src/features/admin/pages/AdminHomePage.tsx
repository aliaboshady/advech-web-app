import { useRouteContext } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { adminHasNoRoles } from "@/features/access/admin-has-no-roles";
import { AdminNoAccess } from "../components/AdminNoAccess";

/** Admin home. An Admin with no Roles sees the no-access screen. */
export function AdminHomePage() {
	const { t } = useTranslation();
	const { me } = useRouteContext({ from: "__root__" });
	if (adminHasNoRoles(me?.access ?? null)) {
		return <AdminNoAccess reason="no-roles" />;
	}
	return (
		<PageLayout title={t("admin.home.title")}>
			<p className="text-sm text-muted-foreground">{t("admin.home.welcome")}</p>
		</PageLayout>
	);
}
