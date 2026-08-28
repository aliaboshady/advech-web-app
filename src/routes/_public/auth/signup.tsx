import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import i18n from "@/i18n";

export const Route = createFileRoute("/_public/auth/signup")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("signup.title")}`,
			},
		],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	return <SignupPage />;
}
