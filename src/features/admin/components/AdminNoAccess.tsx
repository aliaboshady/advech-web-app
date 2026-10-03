import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";

type AdminNoAccessProps = {
	readonly reason: "no-roles" | "permission-denied";
};

/** The in-page state when an Admin cannot use the current screen. */
export function AdminNoAccess({ reason }: AdminNoAccessProps) {
	const { t } = useTranslation();
	const description =
		reason === "no-roles"
			? t("admin.noAccess.noRoles")
			: t("admin.noAccess.permissionDenied");
	return (
		<PageLayout title={t("admin.noAccess.title")}>
			<p className="text-sm text-muted-foreground" role="status">
				{description}
			</p>
		</PageLayout>
	);
}
