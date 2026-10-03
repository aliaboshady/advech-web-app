import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon, SquareAsteriskIcon } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { saveTokens } from "@/lib/tokenUtils";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { resendCode } from "../api/resend-code";
import { verifyEmail } from "../api/verify-email";
import {
	ResendCodePayload,
	ResendCodeResponse,
	VerifyEmailPayload,
	VerifyEmailResponse,
} from "../types";

type VerifyEmailLocationState = {
	email?: string;
	token?: string;
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

export function VerifyEmailPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { start: startTopLoader } = useTopLoader();
	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");
	const [code, setCode] = useState("");
	const [expiresIn, setExpiresIn] = useState(0);
	const [resendAvailableIn, setResendAvailableIn] = useState(0);

	const updateStoredState = (
		next: Partial<VerifyEmailLocationState> & { email?: string },
	) => {
		const storedState = {
			email: next.email ?? email,
			token: next.token ?? token,
			expiresInSeconds: next.expiresInSeconds ?? expiresIn,
			resendAvailableInSeconds:
				next.resendAvailableInSeconds ?? resendAvailableIn,
			devCode: next.devCode ?? code,
		};

		sessionStorage.setItem("verify-email-state", JSON.stringify(storedState));
	};

	const { request: requestResend, isLoading: isLoadingResend } = useRequest<
		ResendCodePayload,
		ServerResponse<ResendCodeResponse>
	>(resendCode, {});

	const { request: requestVerify, isLoading: isLoadingVerify } = useRequest<
		VerifyEmailPayload,
		ServerResponse<VerifyEmailResponse>
	>(verifyEmail, {
		onSuccess: async (res: ServerResponse<VerifyEmailResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				startTopLoader();
				saveTokens(accessToken, refreshToken);
				sessionStorage.removeItem("verify-email-state");
				await router.invalidate();
				await router.navigate({ to: "/" });
			}
		},
	});

	useEffect(() => {
		const rawState = sessionStorage.getItem("verify-email-state");

		if (!rawState) {
			return;
		}

		try {
			const state = JSON.parse(rawState) as VerifyEmailLocationState;

			setEmail(state.email ?? "");
			setToken(state.token ?? "");
			setCode(state.devCode ?? state.code ?? "");
			setExpiresIn(Math.max(0, Number(state.expiresInSeconds ?? 0)));
			setResendAvailableIn(
				Math.max(0, Number(state.resendAvailableInSeconds ?? 0)),
			);
		} catch {
			console.error("Failed to parse verification state from storage");
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

	const handleResend = async () => {
		if (!email) return;

		const res = await requestResend({ email });
		const payload = res?.data;

		if (!payload) return;

		const nextExpiresIn = Math.max(0, Number(payload.expiresInSeconds ?? 0));
		const nextResendAvailableIn = Math.max(
			0,
			Number(payload.resendAvailableInSeconds ?? 0),
		);
		const nextToken = payload.token ?? token;
		const nextCode = payload.devCode ?? "";

		setExpiresIn(nextExpiresIn);
		setResendAvailableIn(nextResendAvailableIn);
		setToken(nextToken);
		setCode(nextCode);
		updateStoredState({
			email,
			token: nextToken,
			expiresInSeconds: nextExpiresIn,
			resendAvailableInSeconds: nextResendAvailableIn,
			devCode: nextCode,
		});
	};

	const formik = useFormik({
		initialValues: { email, code },
		enableReinitialize: true,
		validationSchema: validationSchema.verifyEmail,
		onSubmit: async (values) => {
			if (!token) return;

			try {
				await requestVerify({
					token,
					code: values.code,
				});
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	return (
		<AuthShell
			title={t("verifyEmail.title")}
			description={t("verifyEmail.description")}
		>
			<form onSubmit={formik.handleSubmit} className="flex flex-col gap-stack">
				<FormikTextInput
					formik={formik}
					label={t("login.email")}
					placeholder={t("login.emailPlaceholder")}
					name="email"
					icon={<MailIcon size={15} />}
				/>

				<FormikTextInput
					formik={formik}
					label={t("verifyEmail.code")}
					placeholder={t("verifyEmail.codePlaceholder")}
					name="code"
					icon={<SquareAsteriskIcon size={15} />}
				/>

				<div className="flex flex-col gap-2 rounded-md bg-muted p-3 text-body-md text-muted-foreground">
					<div className="flex items-center justify-between gap-2">
						<span>{t("verifyEmail.expiresIn")}</span>
						<strong className="font-medium text-foreground">
							{formatCountdown(expiresIn)}
						</strong>
					</div>
					<div className="flex items-center justify-between gap-2">
						<span>{t("verifyEmail.resendAvailableIn")}</span>
						<strong className="font-medium text-foreground">
							{formatCountdown(resendAvailableIn)}
						</strong>
					</div>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={
						!formik.isValid || !token || isLoadingVerify || isLoadingResend
					}
				>
					{isLoadingVerify
						? t("verifyEmail.submitting")
						: t("verifyEmail.submit")}
				</Button>

				{resendAvailableIn <= 0 && (
					<Button
						type="button"
						variant="outline"
						className="w-full"
						disabled={
							!formik.values.email ||
							!!formik.errors.email ||
							isLoadingVerify ||
							isLoadingResend
						}
						onClick={handleResend}
					>
						{isLoadingResend
							? t("verifyEmail.sending")
							: t("verifyEmail.resend")}
					</Button>
				)}
			</form>
		</AuthShell>
	);
}
