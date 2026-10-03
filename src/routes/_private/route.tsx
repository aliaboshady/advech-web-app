import { createFileRoute, redirect } from "@tanstack/react-router";
import { PrivateShell } from "@/components/PrivateShell";
import {
	decideRoute,
	routeAreaFromPathname,
	sessionNavigation,
} from "@/features/access/decide-route";

export const Route = createFileRoute("/_private")({
	beforeLoad: ({ context, location }) => {
		const navigation = sessionNavigation(
			decideRoute({
				actor: context.me,
				area: routeAreaFromPathname(location.pathname),
				redirectTarget: location.pathname === "/" ? undefined : location.href,
			}),
		);
		if (navigation.kind === "stay") {
			return;
		}
		if (navigation.kind === "href") {
			throw redirect({ href: navigation.href });
		}
		if (navigation.to === "/") {
			throw redirect({ to: "/" });
		}
		throw redirect({
			to: "/auth/login",
			search: navigation.search,
		});
	},

	component: PrivateRoute,
});

function PrivateRoute() {
	return <PrivateShell />;
}
