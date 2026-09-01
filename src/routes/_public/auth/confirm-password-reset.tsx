import { createFileRoute } from "@tanstack/react-router";
import { ConfirmPasswordResetPage } from "@/features/auth/pages/ConfirmPasswordResetPage";
import i18n from "@/i18n";

export const Route = createFileRoute("/_public/auth/confirm-password-reset")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("passwordReset.confirm.title")}`,
			},
		],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	return <ConfirmPasswordResetPage />;
}
