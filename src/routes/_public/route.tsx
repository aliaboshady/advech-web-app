import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { signedInLeavePublic } from "@/features/access/decide-route";

export const Route = createFileRoute("/_public")({
	beforeLoad: ({ context, search }) => {
		if (!context?.me) {
			return;
		}
		const redirectUrl = (search as { redirectUrl?: string }).redirectUrl;
		const navigation = signedInLeavePublic({
			actor: context.me,
			redirectUrl,
		});
		if (navigation.kind === "href") {
			throw redirect({ href: navigation.href });
		}
		if (navigation.kind === "to" && navigation.to === "/") {
			throw redirect({ to: "/" });
		}
		if (navigation.kind === "to" && navigation.to === "/auth/login") {
			throw redirect({ to: "/auth/login", search: navigation.search });
		}
	},
	component: () => <Outlet />,
});
