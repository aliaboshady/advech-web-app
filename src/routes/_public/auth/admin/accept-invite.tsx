import { createFileRoute } from "@tanstack/react-router";
import { AcceptAdminInvitePage } from "@/features/admin/pages/AcceptAdminInvitePage";
import i18n from "@/i18n";

interface AcceptAdminInviteSearch {
	token?: string;
}

export const Route = createFileRoute("/_public/auth/admin/accept-invite")({
	head: () => ({
		meta: [
			{
				title: `Advech - ${i18n.t("admin.acceptInvite.title")}`,
			},
		],
	}),
	validateSearch: (
		search: Record<string, unknown>,
	): AcceptAdminInviteSearch => {
		if (typeof search.token === "string" && search.token.length > 0) {
			return { token: search.token };
		}
		return {};
	},
	component: AcceptAdminInviteRoute,
});

function AcceptAdminInviteRoute() {
	return <AcceptAdminInvitePage />;
}
