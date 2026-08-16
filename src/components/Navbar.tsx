import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<div className="text-sm font-semibold tracking-tight text-foreground">
					Advech
				</div>

				<ThemeToggle />
			</div>
		</nav>
	);
}
