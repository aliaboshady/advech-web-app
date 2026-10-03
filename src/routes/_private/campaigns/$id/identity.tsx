import { createFileRoute } from "@tanstack/react-router";
import { CampaignIdentityPage } from "@/features/campaigns/pages/CampaignIdentityPage";
import { getLookupOptions } from "@/features/lookups/api/get-lookup-options";

export const Route = createFileRoute("/_private/campaigns/$id/identity")({
	beforeLoad: async () => {
		const lookupsResponse = await getLookupOptions();
		return { lookups: lookupsResponse.data };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign, lookups } = Route.useRouteContext();
	return (
		<CampaignIdentityPage
			id={campaign.id}
			objectives={lookups?.objectives ?? []}
			currencies={lookups?.currencies ?? []}
			campaign={campaign}
		/>
	);
}
