import { useRouteContext } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { mayAdmin } from "@/features/access/may-admin";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { handleFormikError, isErrorResponse } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import {
	CreatedAdminInvite,
	createAdminInvite,
} from "../api/create-admin-invite";
import { buildAdminInviteRequest } from "../build-admin-invite-request";
import { AdminNoAccess } from "../components/AdminNoAccess";

const INVITE_PERMISSION = "admins:invite";

/** Shows the expiry the backend returned. Never invents a duration. */
function formatInviteExpiresAt(expiresAt: string, language: string): string {
	const parsed = new Date(expiresAt);
	if (Number.isNaN(parsed.getTime())) {
		return expiresAt;
	}
	return new Intl.DateTimeFormat(language, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(parsed);
}

/** Invite screen. Hidden unless this Admin may invite other Admins. */
export function AdminInvitesPage() {
	const { t, i18n } = useTranslation();
	const { me } = useRouteContext({ from: "__root__" });
	const [sentInvite, setSentInvite] = useState<CreatedAdminInvite | null>(null);
	const { request, isLoading, error } = useRequest<
		{ readonly email: string },
		ServerResponse<CreatedAdminInvite>
	>(createAdminInvite, {
		showErrorToast: false,
		onSuccess: (response) => {
			if (response.data) {
				setSentInvite(response.data);
			}
		},
	});
	const formik = useFormik({
		initialValues: { email: "" },
		validationSchema: validationSchema.adminInvite,
		onSubmit: async (values) => {
			const built = buildAdminInviteRequest(values.email);
			if (!built.ok) {
				const message =
					built.reason === "email-required" ? "emailRequired" : "invalidEmail";
				formik.setFieldTouched("email", true, false);
				formik.setFieldError("email", message);
				return;
			}
			setSentInvite(null);
			try {
				await request(built.request);
			} catch (submitError) {
				handleFormikError(submitError, formik);
			}
		},
	});
	if (!mayAdmin(me?.access ?? null, INVITE_PERMISSION)) {
		return <AdminNoAccess reason="permission-denied" />;
	}
	const devToken =
		import.meta.env.DEV && sentInvite?.devToken
			? sentInvite.devToken
			: undefined;
	return (
		<PageLayout title={t("admin.invites.title")}>
			<p className="mb-4 max-w-md text-sm text-muted-foreground">
				{t("admin.invites.description")}
			</p>
			<form onSubmit={formik.handleSubmit} className="max-w-md space-y-4">
				<FormikTextInput
					formik={formik}
					label={t("login.email")}
					placeholder={t("login.emailPlaceholder")}
					name="email"
					autoComplete="email"
					icon={<MailIcon size={15} />}
				/>
				{isErrorResponse(error) ? (
					<p className="text-sm text-destructive" role="alert">
						{resolveErrorMessage(error, i18n.language)}
					</p>
				) : null}
				{sentInvite ? (
					<p className="text-sm" role="status">
						{t("admin.invites.sent", {
							email: sentInvite.email,
							expiresAt: formatInviteExpiresAt(
								sentInvite.expiresAt,
								i18n.language,
							),
						})}
					</p>
				) : null}
				{devToken ? (
					<p className="text-sm text-muted-foreground">
						{t("admin.invites.devToken", { token: devToken })}
					</p>
				) : null}
				<Button type="submit" disabled={!formik.isValid || isLoading}>
					{isLoading
						? t("admin.invites.submitting")
						: t("admin.invites.submit")}
				</Button>
			</form>
		</PageLayout>
	);
}
