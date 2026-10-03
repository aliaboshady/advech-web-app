import { createFileRoute } from "@tanstack/react-router";
import { CampaignCreativePage } from "@/features/campaigns/pages/CampaignCreativePage";

export const Route = createFileRoute("/_private/campaigns/$id/creative")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign } = Route.useRouteContext();
	return <CampaignCreativePage id={campaign.id} campaign={campaign} />;
}
