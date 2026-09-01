import { createFileRoute } from "@tanstack/react-router";
import { RequestPasswordResetPage } from "@/features/auth/pages/RequestPasswordResetPage";
import i18n from "@/i18n";

export const Route = createFileRoute("/_public/auth/request-password-reset")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("passwordReset.request.title")}`,
			},
		],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	return <RequestPasswordResetPage />;
}
