import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />

				<SidebarInset>
					<Navbar />
					<main className="flex flex-1 flex-col">
						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
