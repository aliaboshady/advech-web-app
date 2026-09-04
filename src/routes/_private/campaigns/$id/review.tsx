import { createFileRoute } from "@tanstack/react-router";
import { CampaignReviewPage } from "@/features/campaigns/pages/CampaignReviewPage";

export const Route = createFileRoute("/_private/campaigns/$id/review")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CampaignReviewPage id={Route.useParams().id} />;
}
