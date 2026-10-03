import { createFileRoute } from "@tanstack/react-router";
import { CampaignTargetingPage } from "@/features/campaigns/pages/CampaignTargetingPage";
import { getLookupOptions } from "@/features/lookups/api/get-lookup-options";
import { listZones } from "@/features/zones/api/list-zones";

export const Route = createFileRoute("/_private/campaigns/$id/targeting")({
	beforeLoad: async () => {
		const [lookupsResponse, zonesResponse] = await Promise.all([
			getLookupOptions(),
			listZones(),
		]);
		return {
			lookups: lookupsResponse.data,
			zones: zonesResponse.data ?? [],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign, lookups, zones } = Route.useRouteContext();
	return (
		<CampaignTargetingPage
			id={campaign.id}
			campaign={campaign}
			timeZones={lookups?.timeZones ?? []}
			schedulePresets={lookups?.schedulePresets ?? []}
			interests={lookups?.interests ?? []}
			venueTypes={lookups?.venueTypes ?? []}
			zones={zones}
		/>
	);
}
