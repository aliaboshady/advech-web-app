import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LoadErrorState } from "@/components/LoadErrorState";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { resolveErrorMessage } from "@/lib/error-messages";
import { ErrorResponse } from "@/types";
import { RoleForm } from "../components/RoleForm";
import { Permission, Role } from "../types";

type RoleFormPageProps = {
	readonly mode: "create" | "edit";
	readonly permissions: readonly Permission[];
	readonly existingRole: Role | null;
	readonly roleError: ErrorResponse | null;
};

/** Create or edit a Role. A missing Role shows its message instead of the form. */
export function RoleFormPage({
	mode,
	permissions,
	existingRole,
	roleError,
}: RoleFormPageProps) {
	const { t, i18n } = useTranslation();
	const title =
		mode === "edit" ? t("admin.roles.editTitle") : t("admin.roles.createTitle");
	const breadcrumbs = [
		{ label: t("admin.roles.title"), link: "/admin/roles" },
		{ label: title },
	];
	if (mode === "edit" && (roleError || existingRole === null)) {
		const message = roleError
			? resolveErrorMessage(roleError, i18n.language)
			: t("errors.ROLE_NOT_FOUND");
		return (
			<PageLayout breadcrumbs={breadcrumbs}>
				<LoadErrorState
					description={message}
					action={
						<Button variant="outline" asChild>
							<Link to="/admin/roles">{t("admin.roles.back")}</Link>
						</Button>
					}
				/>
			</PageLayout>
		);
	}
	return (
		<PageLayout breadcrumbs={breadcrumbs}>
			<RoleForm permissions={permissions} existingRole={existingRole} />
		</PageLayout>
	);
}
