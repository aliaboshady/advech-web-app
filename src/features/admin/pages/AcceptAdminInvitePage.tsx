import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import {
	AuthFormError,
	AuthShell,
	authLinkClass,
} from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { handleFormikError, isErrorResponse } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { acceptAdminInvite } from "../api/accept-admin-invite";
import {
	AcceptAdminInvitePayload,
	buildAcceptAdminInvitePayload,
} from "../build-accept-admin-invite-payload";
import { isSpentAdminToken } from "../is-spent-admin-token";

const acceptInviteRoute = getRouteApi("/_public/auth/admin/accept-invite");

export function AcceptAdminInvitePage() {
	const navigate = useNavigate();
	const { token } = acceptInviteRoute.useSearch();
	const { t, i18n } = useTranslation();
	const { request, isLoading, isSuccess, error } = useRequest<
		AcceptAdminInvitePayload,
		ServerResponse<null>
	>(acceptAdminInvite, {
		showErrorToast: false,
		onSuccess: async () => {
			await navigate({ to: "/auth/admin/login" });
		},
	});
	const formik = useFormik({
		initialValues: { firstName: "", lastName: "", password: "" },
		validateOnMount: true,
		validate: (values) => {
			const built = buildAcceptAdminInvitePayload({
				token: token ?? "",
				firstName: values.firstName,
				lastName: values.lastName,
				password: values.password,
			});
			if (built.ok) {
				return {};
			}
			return { ...built.fields };
		},
		onSubmit: async (values) => {
			const built = buildAcceptAdminInvitePayload({
				token: token ?? "",
				firstName: values.firstName,
				lastName: values.lastName,
				password: values.password,
			});
			if (!built.ok) {
				return;
			}
			try {
				await request(built.payload);
			} catch (submitError) {
				handleFormikError(submitError, formik);
			}
		},
	});
	return (
		<AuthShell
			title={t("admin.acceptInvite.title")}
			description={t("admin.acceptInvite.description")}
		>
			{token ? (
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-stack"
				>
					<FormikTextInput
						formik={formik}
						label={t("admin.acceptInvite.firstName")}
						placeholder={t("admin.acceptInvite.firstNamePlaceholder")}
						name="firstName"
						autoComplete="given-name"
						icon={<UserIcon size={15} />}
					/>
					<FormikTextInput
						formik={formik}
						label={t("admin.acceptInvite.lastName")}
						placeholder={t("admin.acceptInvite.lastNamePlaceholder")}
						name="lastName"
						autoComplete="family-name"
						icon={<UserIcon size={15} />}
					/>
					<FormikTextInput
						formik={formik}
						label={t("admin.acceptInvite.password")}
						placeholder={t("admin.acceptInvite.passwordPlaceholder")}
						name="password"
						autoComplete="new-password"
						icon={<KeyRoundIcon size={15} />}
						isPassword
					/>
					{isErrorResponse(error) ? (
						<AuthFormError>
							{resolveErrorMessage(error, i18n.language)}
							{isSpentAdminToken(error)
								? ` ${t("admin.acceptInvite.askAgain")}`
								: ""}
						</AuthFormError>
					) : null}
					<Button
						type="submit"
						className="w-full"
						disabled={!formik.isValid || isLoading || isSuccess}
					>
						{isLoading
							? t("admin.acceptInvite.submitting")
							: t("admin.acceptInvite.submit")}
					</Button>
				</form>
			) : (
				<div className="flex flex-col gap-stack">
					<AuthFormError>{t("admin.acceptInvite.missingLink")}</AuthFormError>
					<p className="text-center text-body-md text-muted-foreground">
						<Link to="/auth/admin/login" className={authLinkClass}>
							{t("admin.acceptInvite.signIn")}
						</Link>
					</p>
				</div>
			)}
		</AuthShell>
	);
}
