import { createFileRoute } from "@tanstack/react-router";
import { NewCampaignPage } from "@/features/campaigns/pages/NewCampaignsPage";

export const Route = createFileRoute("/_private/campaigns/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <NewCampaignPage />;
}
