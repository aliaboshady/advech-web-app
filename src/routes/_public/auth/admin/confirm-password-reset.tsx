import { createFileRoute } from "@tanstack/react-router";
import { ConfirmAdminPasswordResetPage } from "@/features/admin/pages/ConfirmAdminPasswordResetPage";
import i18n from "@/i18n";

interface ConfirmAdminPasswordResetSearch {
	token?: string;
}

export const Route = createFileRoute(
	"/_public/auth/admin/confirm-password-reset",
)({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("admin.passwordReset.confirm.title")}`,
			},
		],
	}),
	validateSearch: (
		search: Record<string, unknown>,
	): ConfirmAdminPasswordResetSearch => {
		if (typeof search.token === "string" && search.token.length > 0) {
			return { token: search.token };
		}
		return {};
	},
	component: ConfirmAdminPasswordResetRoute,
});

function ConfirmAdminPasswordResetRoute() {
	return <ConfirmAdminPasswordResetPage />;
}
