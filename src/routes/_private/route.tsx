import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Navbar } from "@/components/Navbar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

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
		<SidebarProvider>
			<AppSidebar />

			<SidebarInset>
				{/* <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
					<SidebarTrigger className="md:hidden" />
					<div className="flex-1" />
					<div className="hidden items-center gap-2 md:flex">
						<ThemeToggle />
						<LanguageToggle />
					</div>
				</header> */}
				<Navbar />
				<main className="flex flex-1 flex-col">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
