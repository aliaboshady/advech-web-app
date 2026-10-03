import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
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

	component: PrivateLayout,
});

function PrivateLayout() {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />

				<SidebarInset>
					<Navbar />
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
