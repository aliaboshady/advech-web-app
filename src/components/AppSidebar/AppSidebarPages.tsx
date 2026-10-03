import { Link, useLocation } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";
import { sidebarItemClassName } from "@/components/AppSidebar/sidebar-item-style";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarPages({
	pages,
}: {
	pages: {
		name: string;
		url: string;
		icon: LucideIcon;
	}[];
}) {
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarMenu>
				{pages.map((item) => {
					const isActive =
						item.url === "/"
							? location.pathname === "/"
							: location.pathname === item.url ||
								location.pathname.startsWith(`${item.url}/`);

					return (
						<SidebarMenuItem key={item.name}>
							<SidebarMenuButton
								tooltip={item.name}
								asChild
								isActive={isActive}
								className={sidebarItemClassName(isActive)}
							>
								<Link to={item.url}>
									<item.icon />
									<span>{item.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
