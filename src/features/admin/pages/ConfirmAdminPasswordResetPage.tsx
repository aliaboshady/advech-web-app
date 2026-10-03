import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon } from "lucide-react";
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
		<AuthShell
			title={t("admin.passwordReset.confirm.title")}
			description={t("admin.passwordReset.confirm.description")}
		>
			{token ? (
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-stack"
				>
					<FormikTextInput
						formik={formik}
						label={t("admin.passwordReset.confirm.password")}
						placeholder={t("admin.passwordReset.confirm.passwordPlaceholder")}
						name="password"
						autoComplete="new-password"
						icon={<KeyRoundIcon size={15} />}
						isPassword
					/>
					{isErrorResponse(error) ? (
						<AuthFormError className="flex flex-col gap-2">
							<p>{resolveErrorMessage(error, i18n.language)}</p>
							{isSpentAdminToken(error) ? (
								<Link
									to="/auth/admin/request-password-reset"
									className={authLinkClass}
								>
									{t("admin.passwordReset.confirm.requestAnother")}
								</Link>
							) : null}
						</AuthFormError>
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
				</form>
			) : (
				<div className="flex flex-col gap-stack">
					<AuthFormError>
						{t("admin.passwordReset.confirm.missingLink")}
					</AuthFormError>
					<p className="text-center text-body-md text-muted-foreground">
						<Link
							to="/auth/admin/request-password-reset"
							className={authLinkClass}
						>
							{t("admin.passwordReset.confirm.requestAnother")}
						</Link>
					</p>
				</div>
			)}
		</AuthShell>
	);
}
