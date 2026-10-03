import { createFileRoute } from "@tanstack/react-router";
import { observePermissionDenied } from "@/features/access/observe-permission-denied";
import { getRole } from "@/features/roles/api/get-role";
import { listPermissions } from "@/features/roles/api/list-permissions";
import { RoleFormPage } from "@/features/roles/pages/RoleFormPage";

export const Route = createFileRoute("/_private/admin/roles/$id")({
	beforeLoad: async ({ params }) => {
		const [roleResponse, permissionsResponse] = await Promise.all([
			getRole(params.id),
			listPermissions(),
		]);
		observePermissionDenied(roleResponse.error ?? permissionsResponse.error);
		return {
			role: roleResponse.data ?? null,
			roleError: roleResponse.error ?? null,
			permissions: permissionsResponse.data ?? [],
		};
	},
	component: EditRoleRoute,
});

function EditRoleRoute() {
	const { role, roleError, permissions } = Route.useRouteContext();
	return (
		<RoleFormPage
			mode="edit"
			permissions={permissions}
			existingRole={role}
			roleError={roleError}
		/>
	);
}
