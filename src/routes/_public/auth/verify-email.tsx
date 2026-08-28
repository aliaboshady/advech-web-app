import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import i18n from "@/i18n";

export const Route = createFileRoute("/_public/auth/verify-email")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("verifyEmail.title")}`,
			},
		],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	return <VerifyEmailPage />;
}
