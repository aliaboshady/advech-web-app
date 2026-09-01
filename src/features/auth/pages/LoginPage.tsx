import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
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
import useRequest from "@/hooks/useRequest";
import { saveTokens } from "@/lib/tokenUtils";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { login } from "../api/login";
import { LanguageAndTheme } from "../components/LanguageAndTheme";
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
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<img src={logoLockup} alt="Advech" className="mb-4 h-10 w-auto" />
					<CardTitle>{t("login.title")}</CardTitle>
					<CardDescription>{t("login.description")}</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
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

						<p className="text-end text-sm text-muted-foreground">
							<Link
								to="/auth/request-password-reset"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
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

						<p className="text-center text-sm text-muted-foreground">
							{t("login.noAccount")}{" "}
							<Link
								to="/auth/signup"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								{t("login.createAccount")}
							</Link>
						</p>

						<LanguageAndTheme />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
