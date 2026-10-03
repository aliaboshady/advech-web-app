import { Logo } from "@/components/Logo";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarTrigger } from "./ui/sidebar";

export function Navbar() {
	return (
		<header className="glass sticky top-0 z-50 w-full border-b">
			<div className="flex items-center justify-between gap-2 px-2 py-3">
				<div className="flex items-center gap-2">
					<SidebarTrigger />
					<span className="md:hidden">
						<Logo variant="icon" className="size-5" />
					</span>
				</div>

				<div className="flex items-center gap-2 pe-2">
					<ThemeToggle />
					<LanguageToggle />
				</div>
			</div>
		</header>
	);
}
