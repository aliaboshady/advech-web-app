import { createFileRoute } from "@tanstack/react-router";
import { AdminInvitesPage } from "@/features/admin/pages/AdminInvitesPage";

export const Route = createFileRoute("/_private/admin/invites")({
	component: AdminInvitesRoute,
});

function AdminInvitesRoute() {
	return <AdminInvitesPage />;
}
