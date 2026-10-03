import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { signedInLeavePublic } from "@/features/access/decide-route";
import {
	AuthFormError,
	AuthShell,
	authLinkClass,
} from "@/features/auth/components/AuthShell";
import { LoginPayload, LoginResponse } from "@/features/auth/types";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { saveTokens } from "@/lib/tokenUtils";
import { handleFormikError, isErrorResponse } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { loginAdmin } from "../api/login-admin";

const adminLoginRoute = getRouteApi("/_public/auth/admin/login");

export function AdminLoginPage() {
	const router = useRouter();
	const { redirectUrl } = adminLoginRoute.useSearch();
	const { t, i18n } = useTranslation();
	const { start: startTopLoader } = useTopLoader();
	const { request, isLoading, isSuccess, error } = useRequest<
		LoginPayload,
		ServerResponse<LoginResponse>
	>(loginAdmin, {
		showErrorToast: false,
		onSuccess: async (res: ServerResponse<LoginResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				startTopLoader();
				saveTokens(accessToken, refreshToken);
				await router.invalidate();
				const navigation = signedInLeavePublic({
					actor: { actorType: "ADMIN" },
					redirectUrl,
				});
				if (navigation.kind === "href") {
					await router.navigate({ href: navigation.href });
					return;
				}
				if (navigation.kind === "to" && navigation.to === "/") {
					await router.navigate({ to: "/" });
				}
			}
		},
	});
	const formik = useFormik({
		initialValues: { email: "", password: "" },
		validationSchema: validationSchema.login,
		onSubmit: async (values) => {
			try {
				await request({
					email: values.email,
					password: values.password,
				});
			} catch (submitError) {
				handleFormikError(submitError, formik);
			}
		},
	});
	return (
		<AuthShell
			title={t("admin.login.title")}
			description={t("admin.login.description")}
		>
			<form onSubmit={formik.handleSubmit} className="flex flex-col gap-stack">
				<FormikTextInput
					formik={formik}
					label={t("login.email")}
					placeholder={t("login.emailPlaceholder")}
					name="email"
					autoComplete="username"
					icon={<MailIcon size={15} />}
				/>
				<FormikTextInput
					formik={formik}
					label={t("login.password")}
					placeholder={t("login.passwordPlaceholder")}
					name="password"
					autoComplete="current-password"
					icon={<KeyRoundIcon size={15} />}
					isPassword
				/>
				<p className="text-end text-body-md text-muted-foreground">
					<Link
						to="/auth/admin/request-password-reset"
						className={authLinkClass}
					>
						{t("admin.login.forgotPassword")}
					</Link>
				</p>
				{isErrorResponse(error) ? (
					<AuthFormError>
						{resolveErrorMessage(error, i18n.language)}
					</AuthFormError>
				) : null}
				<Button
					type="submit"
					className="w-full"
					disabled={!formik.isValid || isLoading || isSuccess}
				>
					{isLoading ? t("admin.login.submitting") : t("admin.login.submit")}
				</Button>
			</form>
		</AuthShell>
	);
}
