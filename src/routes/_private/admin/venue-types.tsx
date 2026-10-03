import { createFileRoute } from "@tanstack/react-router";
import { venueTypesLookup } from "@/features/admin/lookups/lookup-resources";
import { LookupManagementPage } from "@/features/admin/lookups/pages/LookupManagementPage";

export const Route = createFileRoute("/_private/admin/venue-types")({
	component: VenueTypesRoute,
});

function VenueTypesRoute() {
	return <LookupManagementPage resource={venueTypesLookup} />;
}
