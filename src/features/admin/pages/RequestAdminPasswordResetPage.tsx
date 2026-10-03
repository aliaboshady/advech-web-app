import { Link } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon } from "lucide-react";
import { useState } from "react";
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
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import {
	RequestAdminPasswordResetPayload,
	requestAdminPasswordReset,
} from "../api/request-admin-password-reset";

export function RequestAdminPasswordResetPage() {
	const { t, i18n } = useTranslation();
	const [hasSent, setHasSent] = useState(false);
	const { request, isLoading, error } = useRequest<
		RequestAdminPasswordResetPayload,
		ServerResponse<null>
	>(requestAdminPasswordReset, {
		showErrorToast: false,
		onSuccess: () => {
			setHasSent(true);
		},
	});
	const formik = useFormik({
		initialValues: { email: "" },
		validationSchema: validationSchema.requestPasswordReset,
		onSubmit: async (values) => {
			try {
				await request({ email: values.email });
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
					<CardTitle>{t("admin.passwordReset.request.title")}</CardTitle>
					<CardDescription>
						{t("admin.passwordReset.request.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{hasSent ? (
						<div className="space-y-4">
							<p className="text-sm text-foreground" role="status">
								{t("admin.passwordReset.request.sent")}
							</p>
							<p className="text-center text-sm text-muted-foreground">
								<Link
									to="/auth/admin/login"
									className="font-medium text-primary underline-offset-4 hover:underline"
								>
									{t("admin.passwordReset.request.backToSignIn")}
								</Link>
							</p>
							<LanguageAndTheme />
						</div>
					) : (
						<form onSubmit={formik.handleSubmit} className="space-y-4">
							<FormikTextInput
								formik={formik}
								label={t("login.email")}
								placeholder={t("login.emailPlaceholder")}
								name="email"
								autoComplete="username"
								icon={<MailIcon size={15} />}
							/>
							{isErrorResponse(error) ? (
								<p className="text-sm text-destructive" role="alert">
									{resolveErrorMessage(error, i18n.language)}
								</p>
							) : null}
							<Button
								type="submit"
								className="w-full"
								disabled={!formik.isValid || isLoading}
							>
								{isLoading
									? t("admin.passwordReset.request.submitting")
									: t("admin.passwordReset.request.submit")}
							</Button>
							<p className="text-center text-sm text-muted-foreground">
								<Link
									to="/auth/admin/login"
									className="font-medium text-primary underline-offset-4 hover:underline"
								>
									{t("admin.passwordReset.request.backToSignIn")}
								</Link>
							</p>
							<LanguageAndTheme />
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
