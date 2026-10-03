import { createFileRoute } from "@tanstack/react-router";
import { AdminArea } from "@/features/admin/components/AdminArea";

export const Route = createFileRoute("/_private/admin")({
	component: AdminAreaRoute,
});

function AdminAreaRoute() {
	return <AdminArea />;
}
