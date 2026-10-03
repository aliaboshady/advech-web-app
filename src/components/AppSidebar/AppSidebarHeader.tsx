import { Logo } from "@/components/Logo";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function AppSidebarHeader() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex flex-row items-center gap-3 p-2">
					<Logo variant="icon" className="size-6 shrink-0" />
					<Logo
						variant="wordmark"
						className="h-4 w-auto group-data-[collapsible=icon]:hidden"
					/>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
