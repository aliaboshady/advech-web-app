import { Outlet } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";

/**
 * The stripped-down shell around Onboarding: logo, theme and language
 * toggles, logout. No sidebar, because nothing in the product is open yet.
 */
export function OnboardingShell() {
	const { t } = useTranslation();
	const { handleLogout } = useLogout();
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="glass sticky top-0 z-50 w-full border-b">
				<div className="flex items-center justify-between gap-2 px-4 py-3">
					<Logo variant="wordmark" className="h-6 w-auto" />
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<LanguageToggle />
						<Button variant="outline" size="sm" onClick={handleLogout}>
							<LogOutIcon aria-hidden="true" />
							{t("common.logout")}
						</Button>
					</div>
				</div>
			</header>
			<main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-section p-page">
				<Outlet />
			</main>
		</div>
	);
}
