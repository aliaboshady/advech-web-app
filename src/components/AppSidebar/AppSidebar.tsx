import {
	LayoutDashboardIcon,
	LucideIcon,
	MegaphoneIcon,
	ReceiptIcon,
	SettingsIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Route } from "@/lib/staticKeys";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { AppSidebarPages } from "./AppSidebarPages";

type Page = {
	name: string;
	url: Route;
	icon: LucideIcon;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { i18n, t } = useTranslation();

	const pages: Page[] = [
		{
			name: t("sidebar.dashboard"),
			url: "/",
			icon: LayoutDashboardIcon,
		},
		{
			name: t("sidebar.campaigns"),
			url: "/campaigns",
			icon: MegaphoneIcon,
		},
		{
			name: t("sidebar.billing"),
			url: "/billing",
			icon: ReceiptIcon,
		},
		{
			name: t("sidebar.settings"),
			url: "/settings",
			icon: SettingsIcon,
		},
	];

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
				<AppSidebarPages pages={pages} />
			</SidebarContent>

			<SidebarFooter>
				<AppSidebarFooter />
			</SidebarFooter>
		</Sidebar>
	);
}
