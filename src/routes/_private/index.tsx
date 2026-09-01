import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const Route = createFileRoute("/_private/")({
	component: Home,
});

function Home() {
	return <DashboardPage />;
}
