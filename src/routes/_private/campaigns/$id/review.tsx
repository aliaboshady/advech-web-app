import { createFileRoute } from "@tanstack/react-router";
import { CampaignReviewPage } from "@/features/campaigns/pages/CampaignReviewPage";

export const Route = createFileRoute("/_private/campaigns/$id/review")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign } = Route.useRouteContext();
	return <CampaignReviewPage id={campaign.id} campaign={campaign} />;
}
