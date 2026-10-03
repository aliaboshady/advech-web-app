import { Outlet, useRouteContext } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const AdminSidebar = lazy(() =>
	import("@/features/admin/components/AdminSidebar").then((module) => ({
		default: module.AdminSidebar,
	})),
);
const AdminNavbar = lazy(() =>
	import("@/features/admin/components/AdminNavbar").then((module) => ({
		default: module.AdminNavbar,
	})),
);

/** Picks the Advertiser or Admin shell from the signed-in actor. */
export function PrivateShell() {
	const { me } = useRouteContext({ from: "__root__" });
	const isAdmin = me?.actorType === "ADMIN";
	return (
		<TooltipProvider>
			<SidebarProvider>
				<Suspense fallback={null}>
					{isAdmin ? <AdminSidebar /> : <AppSidebar />}
				</Suspense>
				<SidebarInset>
					<Suspense fallback={null}>
						{isAdmin ? <AdminNavbar /> : <Navbar />}
					</Suspense>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
