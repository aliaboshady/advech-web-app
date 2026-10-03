import { Outlet, useRouteContext } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminNavbar } from "@/features/admin/components/AdminNavbar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

/** Picks the Advertiser or Admin shell from the signed-in actor. */
export function PrivateShell() {
	const { me } = useRouteContext({ from: "__root__" });
	const isAdmin = me?.actorType === "ADMIN";
	return (
		<TooltipProvider>
			<SidebarProvider>
				{isAdmin ? <AdminSidebar /> : <AppSidebar />}
				<SidebarInset>
					{isAdmin ? <AdminNavbar /> : <Navbar />}
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
