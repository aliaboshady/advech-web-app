import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthShell, authLinkClass } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { saveTokens } from "@/lib/tokenUtils";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { login } from "../api/login";
import { LoginPayload, LoginResponse } from "../types";

const loginRoute = getRouteApi("/_public/auth/login");

function getSafeRedirectUrl(redirectUrl: string | undefined): string {
	return redirectUrl?.startsWith("/") && !redirectUrl.startsWith("//")
		? redirectUrl
		: "/";
}

export function LoginPage() {
	const router = useRouter();
	const { redirectUrl } = loginRoute.useSearch();
	const { t } = useTranslation();
	const { start: startTopLoader } = useTopLoader();

	const { request, isLoading, isSuccess } = useRequest<
		LoginPayload,
		ServerResponse<LoginResponse>
	>(login, {
		onSuccess: async (res: ServerResponse<LoginResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				startTopLoader();
				saveTokens(accessToken, refreshToken);
				await router.invalidate();
				await router.navigate({ to: getSafeRedirectUrl(redirectUrl) });
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
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	return (
		<AuthShell title={t("login.title")} description={t("login.description")}>
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
					<Link to="/auth/request-password-reset" className={authLinkClass}>
						{t("login.forgotPassword")}
					</Link>
				</p>

				<Button
					type="submit"
					className="w-full"
					disabled={!formik.isValid || isLoading || isSuccess}
				>
					{isLoading ? t("login.submitting") : t("login.submit")}
				</Button>

				<p className="text-center text-body-md text-muted-foreground">
					{t("login.noAccount")}{" "}
					<Link to="/auth/signup" className={authLinkClass}>
						{t("login.createAccount")}
					</Link>
				</p>
			</form>
		</AuthShell>
	);
}
