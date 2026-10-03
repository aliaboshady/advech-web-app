import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	decideRoute,
	routeAreaFromPathname,
	sessionNavigation,
} from "@/features/access/decide-route";
import { redirectForNavigation } from "@/features/access/redirect-for-navigation";
import { OnboardingShell } from "@/features/onboarding/components/OnboardingShell";
import { fetchOnboardingState } from "@/features/onboarding/fetch-onboarding-state";
import { resolveOnboardingGate } from "@/features/onboarding/onboarding-gate";
import { getAccessToken } from "@/lib/tokenUtils";

export const Route = createFileRoute("/_onboarding")({
	beforeLoad: async ({ context, location }) => {
		redirectForNavigation(
			sessionNavigation(
				decideRoute({
					actor: context.me,
					area: routeAreaFromPathname(location.pathname),
					redirectTarget: location.href,
				}),
			),
		);
		if (context.me === null) {
			return { onboarding: null };
		}
		const gate = await resolveOnboardingGate({
			actorType: context.me.actorType,
			bypassAuth: context.bypassAuth,
			area: "onboarding",
			loadState: () => fetchOnboardingState(getAccessToken()),
		});
		if (gate.decision === "to-home") {
			throw redirect({ to: "/" });
		}
		return { onboarding: gate.onboarding };
	},

	component: OnboardingShell,
});
