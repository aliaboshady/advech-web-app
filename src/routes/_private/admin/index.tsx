import { createFileRoute } from "@tanstack/react-router";
import { AdminHomePage } from "@/features/admin/pages/AdminHomePage";

export const Route = createFileRoute("/_private/admin/")({
	component: AdminHomeRoute,
});

function AdminHomeRoute() {
	return <AdminHomePage />;
}
