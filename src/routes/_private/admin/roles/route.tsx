import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { adminMayOpenPath } from "@/features/access/admin-sidebar";

export const Route = createFileRoute("/_private/admin/roles")({
	beforeLoad: ({ context }) => {
		if (adminMayOpenPath(context.me?.access ?? null, "/admin/roles")) {
			return;
		}
		throw redirect({ to: "/admin" });
	},
	component: RolesLayout,
});

function RolesLayout() {
	return <Outlet />;
}
