import { createFileRoute } from "@tanstack/react-router";
import { NewCampaignPage } from "@/features/campaigns/pages/NewCampaignsPage";
import { getObjectives } from "@/features/Objectives/api/get-objectives";

export const Route = createFileRoute("/_private/campaigns/new")({
	beforeLoad: async () => {
		const objectivesRes = await getObjectives();
		return {
			objectives: objectivesRes.data,
		};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { objectives } = Route.useRouteContext();

	return <NewCampaignPage objectives={objectives || []} />;
}
