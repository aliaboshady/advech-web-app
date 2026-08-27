import {
	useNavigate,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import logoIcon from "@/assets/logo/icon/advech-icon-orange.svg";
import { clearTokens } from "@/lib/tokenUtils";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function Navbar() {
	const navigate = useNavigate();
	const router = useRouter();
	const { me } = useRouteContext({ from: "__root__" });
	const { t } = useTranslation();

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
				<img src={logoIcon} alt="Advech" className="size-8" />

				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-foreground">
						{me?.firstName ?? me?.email}
					</span>

					{me && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleLogout}
							className="rounded-full"
						>
							{t("common.logout")}
						</Button>
					)}

					<ThemeToggle />
					<LanguageToggle />
				</div>
			</div>
		</nav>
	);
}
