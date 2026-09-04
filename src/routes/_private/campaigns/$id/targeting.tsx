import { createFileRoute } from "@tanstack/react-router";
import { CampaignTargetingPage } from "@/features/campaigns/pages/CampaignTargetingPage";

export const Route = createFileRoute("/_private/campaigns/$id/targeting")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CampaignTargetingPage id={Route.useParams().id} />;
}
