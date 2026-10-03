import { Link } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon } from "lucide-react";
import { useState } from "react";
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
		<AuthShell
			title={t("admin.passwordReset.request.title")}
			description={t("admin.passwordReset.request.description")}
		>
			{hasSent ? (
				<div className="flex flex-col gap-stack">
					<p className="text-body-md text-foreground" role="status">
						{t("admin.passwordReset.request.sent")}
					</p>
					<p className="text-center text-body-md text-muted-foreground">
						<Link to="/auth/admin/login" className={authLinkClass}>
							{t("admin.passwordReset.request.backToSignIn")}
						</Link>
					</p>
				</div>
			) : (
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-stack"
				>
					<FormikTextInput
						formik={formik}
						label={t("login.email")}
						placeholder={t("login.emailPlaceholder")}
						name="email"
						autoComplete="username"
						icon={<MailIcon size={15} />}
					/>
					{isErrorResponse(error) ? (
						<AuthFormError>
							{resolveErrorMessage(error, i18n.language)}
						</AuthFormError>
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
					<p className="text-center text-body-md text-muted-foreground">
						<Link to="/auth/admin/login" className={authLinkClass}>
							{t("admin.passwordReset.request.backToSignIn")}
						</Link>
					</p>
				</form>
			)}
		</AuthShell>
	);
}
