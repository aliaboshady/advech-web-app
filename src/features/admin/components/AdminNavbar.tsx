import { useRouteContext } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useLogout";

function adminDisplayName(
	firstName: string | undefined,
	lastName: string | undefined,
	email: string | undefined,
): string {
	const name = [firstName, lastName].filter(Boolean).join(" ");
	return name || email || "";
}

/** Shows who is signed in, their Role labels, and sign-out. */
export function AdminNavbar() {
	const { t } = useTranslation();
	const { me } = useRouteContext({ from: "__root__" });
	const { handleLogout } = useLogout();
	const roleLabels =
		me?.access?.roles.map((role) => role.name).join(" · ") ?? "";
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
			<div className="flex items-center justify-between gap-3 py-3 px-2">
				<SidebarTrigger />
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-sm font-medium">
						{adminDisplayName(me?.firstName, me?.lastName, me?.email)}
					</span>
					{roleLabels ? (
						<span className="truncate text-xs text-muted-foreground">
							{roleLabels}
						</span>
					) : null}
				</div>
				<div className="flex items-center gap-2 pe-2">
					<ThemeToggle />
					<LanguageToggle />
					<Button
						type="button"
						variant="ghost"
						onClick={() => {
							void handleLogout();
						}}
					>
						<LogOut />
						{t("common.logout")}
					</Button>
				</div>
			</div>
		</header>
	);
}
