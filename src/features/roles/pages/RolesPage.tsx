import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
	return (
		<PageLayout title={t("admin.roles.title")}>
			<div className="mb-4 flex justify-end">
				<Button asChild>
					<Link to="/admin/roles/new">{t("admin.roles.create")}</Link>
				</Button>
			</div>
			{roles.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					{t("admin.roles.empty")}
				</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("admin.roles.name")}</TableHead>
							<TableHead>{t("admin.roles.description")}</TableHead>
							<TableHead>{t("admin.roles.permissions")}</TableHead>
							<TableHead>{t("admin.roles.admins")}</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{roles.map((role) => (
							<TableRow key={role.id}>
								<TableCell className="font-medium">{role.name}</TableCell>
								<TableCell>
									{roleDescription(role, t("admin.roles.noDescription"))}
								</TableCell>
								<TableCell>
									<ul className="flex flex-wrap gap-1">
										{role.permissions.map((key) => (
											<li key={key}>
												<Badge variant="outline">{key}</Badge>
											</li>
										))}
									</ul>
								</TableCell>
								<TableCell>
									{t("admin.roles.adminCount", { count: role.adminCount })}
								</TableCell>
								<TableCell>
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
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
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
