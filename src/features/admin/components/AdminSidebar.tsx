import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import { House, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppSidebarHeader } from "@/components/AppSidebar/AppSidebarHeader";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { visibleAdminSidebarEntries } from "@/features/access/admin-sidebar";

const entryIcons: Record<string, LucideIcon> = {
	home: House,
};

/** Sidebar entries this Admin may open. Later screens extend the catalog. */
export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { i18n, t } = useTranslation();
	const { me } = useRouteContext({ from: "__root__" });
	const location = useLocation();
	const entries = visibleAdminSidebarEntries(me?.access ?? null);
	return (
		<Sidebar
			dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}
			side={i18n.dir() === "rtl" ? "right" : "left"}
			collapsible="icon"
			{...props}
		>
			<SidebarHeader>
				<AppSidebarHeader />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{entries.map((entry) => {
							const isActive =
								entry.path === "/admin"
									? location.pathname === "/admin"
									: location.pathname === entry.path ||
										location.pathname.startsWith(`${entry.path}/`);
							if (entry.labelKey === undefined) {
								return null;
							}
							const Icon = entryIcons[entry.id] ?? House;
							const label = t(entry.labelKey);
							return (
								<SidebarMenuItem key={entry.id}>
									<SidebarMenuButton
										tooltip={label}
										asChild
										isActive={isActive}
										className={
											!isActive
												? "hover:bg-primary/20"
												: "hover:bg-primary text-white! hover:text-white dark:hover:text-black pointer-events-none"
										}
									>
										<Link to={entry.path}>
											<Icon />
											<span>{label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
