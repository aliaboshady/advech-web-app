import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/_private")({
	beforeLoad: ({ context }) => {
		if (!context.me) {
			throw redirect({
				to: "/auth/login",
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
