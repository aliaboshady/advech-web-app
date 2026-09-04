import { createFileRoute } from "@tanstack/react-router";
import { CampaignIdPage } from "@/features/campaigns/pages/CampaignIdPage";

export const Route = createFileRoute("/_private/campaigns/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CampaignIdPage id={Route.useParams().id} />;
}
