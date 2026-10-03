import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon } from "lucide-react";
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
import { confirmAdminPasswordReset } from "../api/confirm-admin-password-reset";
import {
	buildConfirmAdminPasswordResetPayload,
	ConfirmAdminPasswordResetPayload,
} from "../build-confirm-admin-password-reset-payload";
import { isSpentAdminToken } from "../is-spent-admin-token";

const confirmResetRoute = getRouteApi(
	"/_public/auth/admin/confirm-password-reset",
);

export function ConfirmAdminPasswordResetPage() {
	const navigate = useNavigate();
	const { token } = confirmResetRoute.useSearch();
	const { t, i18n } = useTranslation();
	const { request, isLoading, isSuccess, error } = useRequest<
		ConfirmAdminPasswordResetPayload,
		ServerResponse<null>
	>(confirmAdminPasswordReset, {
		showErrorToast: false,
		onSuccess: async () => {
			await navigate({ to: "/auth/admin/login" });
		},
	});
	const formik = useFormik({
		initialValues: { password: "" },
		validateOnMount: true,
		validate: (values) => {
			const built = buildConfirmAdminPasswordResetPayload({
				token: token ?? "",
				password: values.password,
			});
			if (built.ok) {
				return {};
			}
			return { ...built.fields };
		},
		onSubmit: async (values) => {
			const built = buildConfirmAdminPasswordResetPayload({
				token: token ?? "",
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
					<CardTitle>{t("admin.passwordReset.confirm.title")}</CardTitle>
					<CardDescription>
						{t("admin.passwordReset.confirm.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{token ? (
						<form onSubmit={formik.handleSubmit} className="space-y-4">
							<FormikTextInput
								formik={formik}
								label={t("admin.passwordReset.confirm.password")}
								placeholder={t(
									"admin.passwordReset.confirm.passwordPlaceholder",
								)}
								name="password"
								autoComplete="new-password"
								icon={<KeyRoundIcon size={15} />}
								isPassword
							/>
							{isErrorResponse(error) ? (
								<div className="space-y-2" role="alert">
									<p className="text-sm text-destructive">
										{resolveErrorMessage(error, i18n.language)}
									</p>
									{isSpentAdminToken(error) ? (
										<Link
											to="/auth/admin/request-password-reset"
											className="text-sm font-medium text-primary underline-offset-4 hover:underline"
										>
											{t("admin.passwordReset.confirm.requestAnother")}
										</Link>
									) : null}
								</div>
							) : null}
							<Button
								type="submit"
								className="w-full"
								disabled={!formik.isValid || isLoading || isSuccess}
							>
								{isLoading
									? t("admin.passwordReset.confirm.submitting")
									: t("admin.passwordReset.confirm.submit")}
							</Button>
							<LanguageAndTheme />
						</form>
					) : (
						<div className="space-y-4">
							<p className="text-sm text-destructive" role="alert">
								{t("admin.passwordReset.confirm.missingLink")}
							</p>
							<p className="text-center text-sm text-muted-foreground">
								<Link
									to="/auth/admin/request-password-reset"
									className="font-medium text-primary underline-offset-4 hover:underline"
								>
									{t("admin.passwordReset.confirm.requestAnother")}
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
