import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCampaign } from "@/features/campaigns/api/get-campaign";
import { CampaignIdentityPage } from "@/features/campaigns/pages/CampaignIdentityPage";
import { getObjectives } from "@/features/Objectives/api/get-objectives";

export const Route = createFileRoute("/_private/campaigns/$id/identity")({
	beforeLoad: async ({ params }) => {
		const objectivesRes = await getObjectives();
		const campaignRes = await getCampaign(params.id);

		if (!campaignRes.data) {
			throw notFound();
		}

		return {
			objectives: objectivesRes.data,
			campaign: campaignRes.data,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { objectives, campaign } = Route.useRouteContext();

	return (
		<CampaignIdentityPage
			id={Route.useParams().id}
			objectives={objectives || []}
			campaign={campaign}
		/>
	);
}
