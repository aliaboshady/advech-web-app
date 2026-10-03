import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoLockup from "@/assets/logo/lockup/advech-lockup-orange.svg";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LanguageAndTheme } from "@/features/auth/components/LanguageAndTheme";
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
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<img src={logoLockup} alt="Advech" className="mb-4 h-10 w-auto" />
					<CardTitle>{t("admin.acceptInvite.title")}</CardTitle>
					<CardDescription>
						{t("admin.acceptInvite.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{token ? (
						<form onSubmit={formik.handleSubmit} className="space-y-4">
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
								<p className="text-sm text-destructive" role="alert">
									{resolveErrorMessage(error, i18n.language)}
									{isSpentAdminToken(error)
										? ` ${t("admin.acceptInvite.askAgain")}`
										: ""}
								</p>
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
							<LanguageAndTheme />
						</form>
					) : (
						<div className="space-y-4">
							<p className="text-sm text-destructive" role="alert">
								{t("admin.acceptInvite.missingLink")}
							</p>
							<p className="text-center text-sm text-muted-foreground">
								<Link
									to="/auth/admin/login"
									className="font-medium text-primary underline-offset-4 hover:underline"
								>
									{t("admin.acceptInvite.signIn")}
								</Link>
							</p>
							<LanguageAndTheme />
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
