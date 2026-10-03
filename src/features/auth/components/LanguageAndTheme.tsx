import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LanguageAndTheme() {
	return (
		<div className="flex items-center justify-center gap-2">
			<ThemeToggle />
			<LanguageToggle />
		</div>
	);
}
