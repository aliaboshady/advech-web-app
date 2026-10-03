import { createFileRoute } from "@tanstack/react-router";
import { interestsLookup } from "@/features/admin/lookups/lookup-resources";
import { LookupManagementPage } from "@/features/admin/lookups/pages/LookupManagementPage";

export const Route = createFileRoute("/_private/admin/interests")({
	component: InterestsRoute,
});

function InterestsRoute() {
	return <LookupManagementPage resource={interestsLookup} />;
}
