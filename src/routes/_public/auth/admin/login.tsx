import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import i18n from "@/i18n";

interface AdminLoginSearch {
	redirectUrl?: string;
}

export const Route = createFileRoute("/_public/auth/admin/login")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("admin.login.title")}`,
			},
		],
	}),
	validateSearch: (search: Record<string, unknown>): AdminLoginSearch => {
		if (
			typeof search.redirectUrl === "string" &&
			search.redirectUrl.startsWith("/") &&
			!search.redirectUrl.startsWith("//")
		) {
			return { redirectUrl: search.redirectUrl };
		}
		return {};
	},
	component: AdminLoginRoute,
});

function AdminLoginRoute() {
	return <AdminLoginPage />;
}
