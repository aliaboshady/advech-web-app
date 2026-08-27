import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_private/")({
	component: Home,
});

function Home() {
	const { t } = useTranslation();

	return (
		<div className="flex min-h-screen items-center justify-center p-8">
			<div className="space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight text-primary">
					{t("home.welcome")}
				</h1>
				<p className="text-lg text-muted-foreground">{t("home.loggedIn")}</p>
			</div>
		</div>
	);
}
