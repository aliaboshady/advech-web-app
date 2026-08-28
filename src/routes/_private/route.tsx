import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/_private")({
	beforeLoad: ({ context, location }) => {
		if (!context.me) {
			throw redirect({
				to: "/auth/login",
				search:
					location.pathname === "/"
						? { redirectUrl: undefined }
						: { redirectUrl: location.href },
			});
		}
	},

	component: PrivateLayout,
});

function PrivateLayout() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}
