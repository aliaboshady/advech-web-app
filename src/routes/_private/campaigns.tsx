import { createFileRoute } from "@tanstack/react-router";
import { CampaignsPage } from "@/features/campaigns/pages/CampaignsPage";

export const Route = createFileRoute("/_private/campaigns")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CampaignsPage />;
}
