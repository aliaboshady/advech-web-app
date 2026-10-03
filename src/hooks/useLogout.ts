import {
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { decideRoute, sessionNavigation } from "@/features/access/decide-route";
import { clearPermissionDenied } from "@/features/access/permission-denied-state";
import { logoutSession } from "@/features/auth/api/logout-session";
import { clearCachedOnboarding } from "@/features/onboarding/load-cached-onboarding";
import { clearCachedMe } from "@/features/users/load-cached-me";
import { clearTokens } from "@/lib/tokenUtils";

export function useLogout() {
	const navigate = useNavigate();
	const router = useRouter();
	const { me } = useRouteContext({ from: "__root__" });
	const handleLogout = async () => {
		const navigation = sessionNavigation(
			decideRoute({
				actor: null,
				area: me?.actorType === "ADMIN" ? "admin" : "advertiser",
				redirectTarget: undefined,
			}),
		);
		try {
			await logoutSession();
		} catch {
			// The local session still ends if the logout request fails.
		}
		clearTokens();
		clearCachedMe();
		clearCachedOnboarding();
		clearPermissionDenied();
		await router.invalidate();
		if (navigation.kind === "href") {
			await navigate({ href: navigation.href });
			return;
		}
		if (navigation.kind === "to" && navigation.to === "/auth/login") {
			await navigate({ to: "/auth/login", search: navigation.search });
		}
	};
	return { handleLogout };
}
