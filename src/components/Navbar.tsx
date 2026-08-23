import {
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { clearTokens } from "@/lib/tokenUtils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function Navbar() {
	const navigate = useNavigate();
	const router = useRouter();
	const { me } = useRouteContext({ from: "__root__" });

	const handleLogout = async () => {
		clearTokens();

		await router.invalidate();

		await navigate({
			to: "/auth/login",
		});
	};

	return (
		<nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<div className="text-sm font-semibold tracking-tight text-foreground">
					Advech
				</div>

				<div className="flex items-center gap-2">
					{me?.name}

					{me && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleLogout}
							className="rounded-full"
						>
							Logout
						</Button>
					)}

					<ThemeToggle />
				</div>
			</div>
		</nav>
	);
}
