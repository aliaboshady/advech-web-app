import logoIcon from "@/assets/logo/icon/advech-icon-orange.svg";
import wordMark from "@/assets/logo/wordmark/advech-wordmark-orange.svg";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function AppSidebarHeader() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="m-2 rounded-none flex flex-row items-center gap-4">
					<img src={logoIcon} alt="Advech" className="size-6 rounded-none!" />
					<img src={wordMark} alt="Advech" className="w-32" />
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
