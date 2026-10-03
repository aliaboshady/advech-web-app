import { LockIcon } from "lucide-react";
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
			<div
				role="status"
				className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-10 text-center"
			>
				<span className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<LockIcon aria-hidden="true" className="size-6" />
				</span>
				<p className="max-w-sm text-body-md text-muted-foreground">
					{description}
				</p>
			</div>
		</PageLayout>
	);
}
