import { createFileRoute } from "@tanstack/react-router";
import { objectivesLookup } from "@/features/admin/lookups/lookup-resources";
import { LookupManagementPage } from "@/features/admin/lookups/pages/LookupManagementPage";

export const Route = createFileRoute("/_private/admin/objectives")({
	component: ObjectivesRoute,
});

function ObjectivesRoute() {
	return <LookupManagementPage resource={objectivesLookup} />;
}
