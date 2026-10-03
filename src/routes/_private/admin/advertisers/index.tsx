import { createFileRoute } from "@tanstack/react-router";
import { AdvertiserQueuePage } from "@/features/admin/advertisers/pages/AdvertiserQueuePage";

export const Route = createFileRoute("/_private/admin/advertisers/")({
	component: AdvertiserQueueRoute,
});

function AdvertiserQueueRoute() {
	return <AdvertiserQueuePage />;
}
