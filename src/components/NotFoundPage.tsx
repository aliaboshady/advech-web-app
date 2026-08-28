import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
	const { t } = useTranslation();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<h1 className="text-4xl font-bold">{t("notFound.title")}</h1>
			<p className="text-muted-foreground">{t("notFound.description")}</p>
			<Link to="/" className="text-primary underline hover:underline">
				{t("notFound.backToHome")}
			</Link>
		</div>
	);
}
