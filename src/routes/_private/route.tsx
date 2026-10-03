import { createFileRoute, redirect } from "@tanstack/react-router";
import { PrivateShell } from "@/components/PrivateShell";
import {
	decideRoute,
	routeAreaFromPathname,
	sessionNavigation,
} from "@/features/access/decide-route";
import { redirectForNavigation } from "@/features/access/redirect-for-navigation";
import { fetchOnboardingState } from "@/features/onboarding/fetch-onboarding-state";
import { resolveOnboardingGate } from "@/features/onboarding/onboarding-gate";
import { ONBOARDING_HOME } from "@/features/onboarding/onboarding-view";
import { getAccessToken } from "@/lib/tokenUtils";

export const Route = createFileRoute("/_private")({
	beforeLoad: async ({ context, location }) => {
		redirectForNavigation(
			sessionNavigation(
				decideRoute({
					actor: context.me,
					area: routeAreaFromPathname(location.pathname),
					redirectTarget: location.pathname === "/" ? undefined : location.href,
				}),
			),
		);
		if (context.me === null) {
			return;
		}
		const gate = await resolveOnboardingGate({
			actorType: context.me.actorType,
			bypassAuth: context.bypassAuth,
			area: "product",
			loadState: () => fetchOnboardingState(getAccessToken()),
		});
		if (gate.decision === "to-onboarding") {
			throw redirect({ to: ONBOARDING_HOME });
		}
	},

	component: PrivateRoute,
});

function PrivateRoute() {
	return <PrivateShell />;
}
