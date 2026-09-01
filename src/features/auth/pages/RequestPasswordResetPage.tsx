import { Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { requestPasswordReset } from "../api/request-password-reset";
import { LanguageAndTheme } from "../components/LanguageAndTheme";
import {
	RequestPasswordResetPayload,
	RequestPasswordResetResponse,
} from "../types";

type PasswordResetLocationState = {
	email?: string;
	expiresInSeconds?: number;
	resendAvailableInSeconds?: number;
	devCode?: string;
};

export function RequestPasswordResetPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");

	const updateStoredState = (
		next: Partial<PasswordResetLocationState> & { email?: string },
	) => {
		const storedState = {
			email: next.email ?? email,
			expiresInSeconds: next.expiresInSeconds ?? 0,
			resendAvailableInSeconds: next.resendAvailableInSeconds ?? 0,
			devCode: next.devCode ?? "",
		};

		sessionStorage.setItem("password-reset-state", JSON.stringify(storedState));
	};

	const { request: requestReset, isLoading: isLoadingReset } = useRequest<
		RequestPasswordResetPayload,
		ServerResponse<RequestPasswordResetResponse>
	>(requestPasswordReset, {
		onSuccess: (res) => {
			const payload = res?.data;

			if (!payload) {
				return;
			}

			updateStoredState({
				email: formik.values.email,
				expiresInSeconds: Number(payload.expiresInSeconds ?? 0),
				resendAvailableInSeconds: Number(payload.resendAvailableInSeconds ?? 0),
				devCode: payload.devCode ?? "",
			});

			navigate({ to: "/auth/confirm-password-reset" });
		},
	});

	useEffect(() => {
		const rawState = sessionStorage.getItem("password-reset-state");

		if (!rawState) {
			return;
		}

		try {
			const state = JSON.parse(rawState) as PasswordResetLocationState;
			setEmail(state.email ?? "");
		} catch {
			console.error("Failed to parse password reset state from storage");
		}
	}, []);

	const formik = useFormik({
		initialValues: { email },
		enableReinitialize: true,
		validationSchema: validationSchema.requestPasswordReset,
		onSubmit: async (values) => {
			try {
				await requestReset({ email: values.email });
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
					<CardTitle>{t("passwordReset.request.title")}</CardTitle>
					<CardDescription>
						{t("passwordReset.request.description")}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<FormikTextInput
							formik={formik}
							label={t("passwordReset.request.email")}
							placeholder={t("passwordReset.request.emailPlaceholder")}
							name="email"
							autoComplete="username"
							icon={<MailIcon size={15} />}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={!formik.isValid || isLoadingReset}
						>
							{isLoadingReset
								? t("passwordReset.request.submitting")
								: t("passwordReset.request.submit")}
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							<Link
								to="/auth/login"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								{t("passwordReset.request.backToLogin")}
							</Link>
						</p>

						<LanguageAndTheme />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
