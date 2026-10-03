import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { getCampaign } from "@/features/campaigns/api/get-campaign";

export const Route = createFileRoute("/_private/campaigns/$id")({
	beforeLoad: async ({ params }) => {
		const campaignResponse = await getCampaign(params.id);
		if (!campaignResponse.data) {
			throw notFound();
		}
		return { campaign: campaignResponse.data };
	},
	component: CampaignLayout,
});

function CampaignLayout() {
	return <Outlet />;
}
