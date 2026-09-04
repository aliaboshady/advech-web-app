import { createFileRoute } from "@tanstack/react-router";
import { CampaignIdentityPage } from "@/features/campaigns/pages/CampaignIdentityPage";

export const Route = createFileRoute("/_private/campaigns/$id/identity")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CampaignIdentityPage id={Route.useParams().id} />;
}
