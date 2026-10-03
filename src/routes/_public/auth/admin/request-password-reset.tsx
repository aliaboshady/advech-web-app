import { createFileRoute } from "@tanstack/react-router";
import { RequestAdminPasswordResetPage } from "@/features/admin/pages/RequestAdminPasswordResetPage";
import i18n from "@/i18n";

export const Route = createFileRoute(
	"/_public/auth/admin/request-password-reset",
)({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("admin.passwordReset.request.title")}`,
			},
		],
	}),
	component: RequestAdminPasswordResetRoute,
});

function RequestAdminPasswordResetRoute() {
	return <RequestAdminPasswordResetPage />;
}
