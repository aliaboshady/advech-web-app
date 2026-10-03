import { createFileRoute } from "@tanstack/react-router";
import { CampaignTargetingPage } from "@/features/campaigns/pages/CampaignTargetingPage";
import { getLookupOptions } from "@/features/lookups/api/get-lookup-options";

export const Route = createFileRoute("/_private/campaigns/$id/targeting")({
	beforeLoad: async () => {
		const lookupsResponse = await getLookupOptions();
		return { lookups: lookupsResponse.data };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign, lookups } = Route.useRouteContext();
	return (
		<CampaignTargetingPage
			id={campaign.id}
			campaign={campaign}
			timeZones={lookups?.timeZones ?? []}
			schedulePresets={lookups?.schedulePresets ?? []}
			interests={lookups?.interests ?? []}
			venueTypes={lookups?.venueTypes ?? []}
		/>
	);
}
