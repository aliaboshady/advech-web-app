import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/features/onboarding/pages/OnboardingPage";
import i18n from "@/i18n";

export const Route = createFileRoute("/_onboarding/onboarding")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("onboarding.wizard.title")}`,
			},
		],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	const { me, onboarding } = Route.useRouteContext();
	return <OnboardingPage userId={me?.id ?? ""} onboarding={onboarding} />;
}
