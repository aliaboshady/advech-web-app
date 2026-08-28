import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";

interface LoginSearch {
	redirectUrl?: string;
}

export const Route = createFileRoute("/_public/auth/login")({
	validateSearch: (search: Record<string, unknown>): LoginSearch => {
		if (
			typeof search.redirectUrl === "string" &&
			search.redirectUrl.startsWith("/") &&
			!search.redirectUrl.startsWith("//")
		) {
			return { redirectUrl: search.redirectUrl };
		}

		return {};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <LoginPage />;
}
