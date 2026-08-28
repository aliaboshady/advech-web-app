import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	beforeLoad: ({ context, search }) => {
		if (context?.me) {
			const redirectUrl = (search as { redirectUrl?: string }).redirectUrl;

			throw redirect({
				to: redirectUrl ?? "/",
			});
		}
	},

	component: () => <Outlet />,
});
