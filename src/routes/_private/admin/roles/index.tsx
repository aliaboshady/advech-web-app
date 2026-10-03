import { createFileRoute } from "@tanstack/react-router";
import { observePermissionDenied } from "@/features/access/observe-permission-denied";
import { listRoles } from "@/features/roles/api/list-roles";
import { RolesPage } from "@/features/roles/pages/RolesPage";

export const Route = createFileRoute("/_private/admin/roles/")({
	beforeLoad: async () => {
		const response = await listRoles();
		observePermissionDenied(response.error);
		return { roles: response.data ?? [] };
	},
	component: RolesIndexRoute,
});

function RolesIndexRoute() {
	const { roles } = Route.useRouteContext();
	return <RolesPage roles={roles} />;
}
