import { createFileRoute } from "@tanstack/react-router";
import { schedulePresetsLookup } from "@/features/admin/lookups/lookup-resources";
import { LookupManagementPage } from "@/features/admin/lookups/pages/LookupManagementPage";

export const Route = createFileRoute("/_private/admin/schedule-presets")({
	component: SchedulePresetsRoute,
});

function SchedulePresetsRoute() {
	return <LookupManagementPage resource={schedulePresetsLookup} />;
}
