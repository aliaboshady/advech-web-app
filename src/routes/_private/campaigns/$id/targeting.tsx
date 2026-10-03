import { createFileRoute } from "@tanstack/react-router";
import { CampaignTargetingPage } from "@/features/campaigns/pages/CampaignTargetingPage";

export const Route = createFileRoute("/_private/campaigns/$id/targeting")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign } = Route.useRouteContext();
	return <CampaignTargetingPage id={campaign.id} campaign={campaign} />;
}
