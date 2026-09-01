import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarTrigger } from "./ui/sidebar";

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
			<div className="flex items-center justify-between py-3">
				<SidebarTrigger />

				<div className="flex items-center gap-2 pe-4">
					<ThemeToggle />
					<LanguageToggle />
				</div>
			</div>
		</header>
	);
}
