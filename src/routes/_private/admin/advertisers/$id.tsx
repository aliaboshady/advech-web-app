import { createFileRoute } from "@tanstack/react-router";
import { AdvertiserDetailPage } from "@/features/admin/advertisers/pages/AdvertiserDetailPage";

export const Route = createFileRoute("/_private/admin/advertisers/$id")({
	component: AdvertiserDetailRoute,
});

function AdvertiserDetailRoute() {
	const { id } = Route.useParams();
	return <AdvertiserDetailPage advertiserId={id} />;
}
