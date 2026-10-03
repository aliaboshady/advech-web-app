import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
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
				<p className="text-sm text-destructive" role="alert">
					{message}
				</p>
			</PageLayout>
		);
	}
	return (
		<PageLayout breadcrumbs={breadcrumbs}>
			<RoleForm permissions={permissions} existingRole={existingRole} />
		</PageLayout>
	);
}
