import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon, SquareAsteriskIcon } from "lucide-react";
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
import { confirmPasswordReset } from "../api/confirm-password-reset";
import { requestPasswordReset } from "../api/request-password-reset";
import { LanguageAndTheme } from "../components/LanguageAndTheme";
import {
	ConfirmPasswordResetPayload,
	RequestPasswordResetPayload,
	RequestPasswordResetResponse,
} from "../types";

type PasswordResetLocationState = {
	email?: string;
	code?: string;
	expiresInSeconds?: number;
	resendAvailableInSeconds?: number;
	devCode?: string;
};

function formatCountdown(seconds: number) {
	const safeSeconds = Math.max(0, seconds);
	const minutes = Math.floor(safeSeconds / 60);
	const remainingSeconds = safeSeconds % 60;

	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
		.toString()
		.padStart(2, "0")}`;
}

export function ConfirmPasswordResetPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [expiresIn, setExpiresIn] = useState(0);
	const [resendAvailableIn, setResendAvailableIn] = useState(0);

	const updateStoredState = (
		next: Partial<PasswordResetLocationState> & { email?: string },
	) => {
		const storedState = {
			email: next.email ?? email,
			expiresInSeconds: next.expiresInSeconds ?? expiresIn,
			resendAvailableInSeconds:
				next.resendAvailableInSeconds ?? resendAvailableIn,
			code: next.code ?? code,
			devCode: next.devCode ?? code,
		};

		sessionStorage.setItem("password-reset-state", JSON.stringify(storedState));
	};

	const { request: requestReset, isLoading: isLoadingReset } = useRequest<
		RequestPasswordResetPayload,
		ServerResponse<RequestPasswordResetResponse>
	>(requestPasswordReset, {});

	const { request: requestConfirm, isLoading: isLoadingConfirm } = useRequest<
		ConfirmPasswordResetPayload,
		void
	>(confirmPasswordReset, {
		onSuccess: () => {
			navigate({ to: "/auth/login" });
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
			setCode(state.devCode ?? state.code ?? "");
			setExpiresIn(Math.max(0, Number(state.expiresInSeconds ?? 0)));
			setResendAvailableIn(
				Math.max(0, Number(state.resendAvailableInSeconds ?? 0)),
			);
		} catch {
			console.error("Failed to parse password reset state from storage");
		}
	}, []);

	useEffect(() => {
		if (expiresIn <= 0) return;

		const timer = window.setInterval(() => {
			setExpiresIn((current) => Math.max(0, current - 1));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [expiresIn]);

	useEffect(() => {
		if (resendAvailableIn <= 0) return;

		const timer = window.setInterval(() => {
			setResendAvailableIn((current) => Math.max(0, current - 1));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [resendAvailableIn]);

	const formik = useFormik({
		initialValues: { email, code, newPassword: "" },
		enableReinitialize: true,
		validationSchema: validationSchema.confirmPasswordReset,
		onSubmit: async (values) => {
			try {
				await requestConfirm({
					email: values.email,
					code: values.code,
					newPassword: values.newPassword,
				});
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	const handleResend = async () => {
		if (!email) return;

		const res = await requestReset({ email });
		const payload = res?.data;

		if (!payload) return;

		const nextExpiresIn = Math.max(0, Number(payload.expiresInSeconds ?? 0));
		const nextResendAvailableIn = Math.max(
			0,
			Number(payload.resendAvailableInSeconds ?? 0),
		);

		setExpiresIn(nextExpiresIn);
		setResendAvailableIn(nextResendAvailableIn);
		setCode(payload.devCode ?? "");
		updateStoredState({
			email,
			expiresInSeconds: nextExpiresIn,
			resendAvailableInSeconds: nextResendAvailableIn,
			devCode: payload.devCode ?? "",
		});
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<img src={logoLockup} alt="Advech" className="mb-4 h-10 w-auto" />
					<CardTitle>{t("passwordReset.confirm.title")}</CardTitle>
					<CardDescription>
						{t("passwordReset.confirm.description")}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<FormikTextInput
							formik={formik}
							label={t("passwordReset.confirm.email")}
							placeholder={t("passwordReset.confirm.emailPlaceholder")}
							name="email"
							autoComplete="username"
							icon={<MailIcon size={15} />}
						/>

						<FormikTextInput
							formik={formik}
							label={t("passwordReset.confirm.code")}
							placeholder={t("passwordReset.confirm.codePlaceholder")}
							name="code"
							icon={<SquareAsteriskIcon size={15} />}
						/>

						<FormikTextInput
							formik={formik}
							label={t("passwordReset.confirm.newPassword")}
							placeholder={t("passwordReset.confirm.newPasswordPlaceholder")}
							name="newPassword"
							icon={<KeyRoundIcon size={15} />}
							isPassword
						/>

						<div className="space-y-2 rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
							<div className="flex items-center justify-between gap-2">
								<span>{t("passwordReset.confirm.expiresIn")}</span>
								<strong className="font-medium text-foreground">
									{formatCountdown(expiresIn)}
								</strong>
							</div>
							<div className="flex items-center justify-between gap-2">
								<span>{t("passwordReset.confirm.resendAvailableIn")}</span>
								<strong className="font-medium text-foreground">
									{formatCountdown(resendAvailableIn)}
								</strong>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={!formik.isValid || isLoadingConfirm || isLoadingReset}
						>
							{isLoadingConfirm
								? t("passwordReset.confirm.submitting")
								: t("passwordReset.confirm.submit")}
						</Button>

						{resendAvailableIn <= 0 && (
							<Button
								type="button"
								variant="outline"
								className="w-full"
								disabled={
									!formik.values.email ||
									!!formik.errors.email ||
									isLoadingConfirm ||
									isLoadingReset
								}
								onClick={handleResend}
							>
								{isLoadingReset
									? t("passwordReset.confirm.sending")
									: t("passwordReset.confirm.resend")}
							</Button>
						)}

						<LanguageAndTheme />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
