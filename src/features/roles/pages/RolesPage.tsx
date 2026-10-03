import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NoDataFound from "@/components/NoDataFound";
import { PageLayout } from "@/components/PageLayout";
import DataTable, { Column } from "@/components/Table/DataTable";
import { TableCard } from "@/components/TableCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteRoleDialog } from "../components/DeleteRoleDialog";
import { Role } from "../types";

type RolesPageProps = {
	readonly roles: readonly Role[];
};

function roleDescription(role: Role, emptyLabel: string): string {
	const description = role.description?.trim() ?? "";
	if (description.length === 0) {
		return emptyLabel;
	}
	return description;
}

/** Lists Roles with their Permissions and how many Admins hold each. */
export function RolesPage({ roles }: RolesPageProps) {
	const { t } = useTranslation();
	const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
	const createButton = (
		<Button asChild>
			<Link to="/admin/roles/new">{t("admin.roles.create")}</Link>
		</Button>
	);
	const columns: Column[] = [
		{
			header: () => t("admin.roles.name"),
			value: (role: Role) => role.name,
		},
		{
			header: () => t("admin.roles.description"),
			value: (role: Role) =>
				roleDescription(role, t("admin.roles.noDescription")),
			cellClassName: "min-w-48 max-w-xs text-wrap font-normal",
		},
		{
			header: () => t("admin.roles.permissions"),
			value: (role: Role) => (
				<ul className="flex flex-wrap gap-1">
					{role.permissions.map((key) => (
						<li key={key}>
							<Badge variant="outline">{key}</Badge>
						</li>
					))}
				</ul>
			),
			cellClassName: "min-w-56 max-w-md text-wrap",
		},
		{
			header: () => t("admin.roles.admins"),
			value: (role: Role) =>
				t("admin.roles.adminCount", { count: role.adminCount }),
			cellClassName: "font-normal text-muted-foreground",
		},
		{
			header: () => <span className="sr-only">{t("admin.roles.actions")}</span>,
			value: (role: Role) => (
				<div className="flex justify-end gap-2">
					<Button variant="outline" size="sm" asChild>
						<Link to="/admin/roles/$id" params={{ id: role.id }}>
							{t("common.edit")}
						</Link>
					</Button>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						onClick={() => setRoleToDelete(role)}
					>
						{t("common.delete")}
					</Button>
				</div>
			),
		},
	];
	return (
		<PageLayout
			title={t("admin.roles.title")}
			description={t("admin.roles.pageDescription")}
			actions={createButton}
			className="gap-section"
		>
			<TableCard>
				{roles.length === 0 ? (
					<NoDataFound
						title={t("admin.roles.empty")}
						description={t("admin.roles.emptyDescription")}
					/>
				) : (
					<DataTable
						className="rounded-none border-0"
						items={[...roles]}
						columns={columns}
					/>
				)}
			</TableCard>
			<DeleteRoleDialog
				role={roleToDelete}
				open={roleToDelete !== null}
				onOpenChange={(open) => {
					if (!open) {
						setRoleToDelete(null);
					}
				}}
			/>
		</PageLayout>
	);
}
