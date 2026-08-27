import { Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { signup } from "../api/signup";
import { LanguageAndTheme } from "../components/LanguageAndTheme";
import { SignupPayload, SignupResponse } from "../types";

export function SignupPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { request, isLoading, isSuccess } = useRequest<
		SignupPayload,
		ServerResponse<SignupResponse>
	>(signup, {
		onStart: () => console.log("Request started"),
		onSuccess: (res) => {
			console.log("Request succeeded", res);
			const payload = res.data;

			if (!payload) {
				return;
			}

			const nextState = {
				email: formik.values.email,
				expiresInSeconds: payload.expiresInSeconds,
				resendAvailableInSeconds: payload.resendAvailableInSeconds,
				devCode: payload.devCode,
			} as any;

			sessionStorage.setItem("verify-email-state", JSON.stringify(nextState));

			navigate({
				to: "/auth/verify-email",
			});
		},
		onError: (err) => console.log("Request failed", err),
	});

	const formik = useFormik({
		initialValues: { email: "", password: "", confirmPassword: "" },
		validationSchema: validationSchema.signup,
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
					<CardTitle>{t("signup.title")}</CardTitle>
					<CardDescription>{t("signup.description")}</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<FormikTextInput
							formik={formik}
							label={t("login.email")}
							placeholder={t("login.emailPlaceholder")}
							name="email"
							autoComplete="username"
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
							icon={<MailIcon size={25} className="text-primary" />}
						/>

						<FormikTextInput
							formik={formik}
							label={t("login.password")}
							placeholder={t("login.passwordPlaceholder")}
							name="password"
							autoComplete="current-password"
							icon={<KeyRoundIcon size={25} className="text-primary" />}
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
							isPassword
						/>

						<FormikTextInput
							formik={formik}
							label={t("signup.confirmPassword")}
							placeholder={t("signup.confirmPasswordPlaceholder")}
							name="confirmPassword"
							icon={<KeyRoundIcon size={25} className="text-primary" />}
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
							isPassword
						/>

						<Button
							disabled={!formik.isValid || isLoading || isSuccess}
							type="submit"
							className="w-full"
						>
							{t("signup.submit")}
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							{t("signup.alreadyAccount")}{" "}
							<Link
								to="/auth/login"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								{t("login.submit")}
							</Link>
						</p>

						<LanguageAndTheme />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
