import { createFileRoute } from "@tanstack/react-router";
import { observePermissionDenied } from "@/features/access/observe-permission-denied";
import { listPermissions } from "@/features/roles/api/list-permissions";
import { RoleFormPage } from "@/features/roles/pages/RoleFormPage";

export const Route = createFileRoute("/_private/admin/roles/new")({
	beforeLoad: async () => {
		const response = await listPermissions();
		observePermissionDenied(response.error);
		return { permissions: response.data ?? [] };
	},
	component: NewRoleRoute,
});

function NewRoleRoute() {
	const { permissions } = Route.useRouteContext();
	return (
		<RoleFormPage
			mode="create"
			permissions={permissions}
			existingRole={null}
			roleError={null}
		/>
	);
}
