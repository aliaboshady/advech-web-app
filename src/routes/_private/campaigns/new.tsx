import { createFileRoute } from "@tanstack/react-router";
import { NewCampaignPage } from "@/features/campaigns/pages/NewCampaignsPage";
import { getLookupOptions } from "@/features/lookups/api/get-lookup-options";

export const Route = createFileRoute("/_private/campaigns/new")({
	beforeLoad: async () => {
		const lookupsResponse = await getLookupOptions();
		return { lookups: lookupsResponse.data };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { lookups } = Route.useRouteContext();
	return (
		<NewCampaignPage
			objectives={lookups?.objectives ?? []}
			currencies={lookups?.currencies ?? []}
		/>
	);
}
