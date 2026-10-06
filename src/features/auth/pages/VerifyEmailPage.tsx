import { useNavigate, useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon, SquareAsteriskIcon } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthFormError, AuthShell } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { getAccessToken, saveTokens } from "@/lib/tokenUtils";
import { handleFormikError, isErrorResponse } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { BackendResponse } from "@/types";
import { resendCode } from "../api/resend-code";
import { verifyEmail } from "../api/verify-email";
import { authErrorMessage } from "../auth-error-message";
import {
	clearOtpState,
	type OtpState,
	otpStateFromResponse,
	prefillCode,
	readOtpState,
	VERIFY_STATE_KEY,
	writeOtpState,
} from "../otp-state";
import { formatCountdown, secondsUntil } from "../otp-timers";
import {
	ResendCodePayload,
	ResendCodeResponse,
	VerifyEmailPayload,
	VerifyEmailResponse,
} from "../types";
import { useNow } from "../use-now";
import { verifyErrorAction } from "../verify-error-action";

function loadState(): OtpState | null {
	return readOtpState(window.sessionStorage, VERIFY_STATE_KEY);
}

export function VerifyEmailPage() {
	const router = useRouter();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { start: startTopLoader } = useTopLoader();
	const [state, setState] = useState<OtpState | null>(loadState);
	const [formError, setFormError] = useState<string | null>(null);
	const now = useNow(
		Math.max(state?.expiresAt ?? 0, state?.resendAvailableAt ?? 0),
	);
	const expiresIn = secondsUntil(state?.expiresAt ?? 0, now);
	const resendAvailableIn = secondsUntil(state?.resendAvailableAt ?? 0, now);
	const token = state?.token ?? "";

	const { request: requestResend, isLoading: isLoadingResend } = useRequest<
		ResendCodePayload,
		BackendResponse<ResendCodeResponse>
	>(resendCode, { showErrorToast: false });

	const { request: requestVerify, isLoading: isLoadingVerify } = useRequest<
		VerifyEmailPayload,
		BackendResponse<VerifyEmailResponse>
	>(verifyEmail, {
		// The screen shows the message itself, next to the form.
		showErrorToast: false,
		onSuccess: async (res: BackendResponse<VerifyEmailResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				startTopLoader();
				saveTokens(accessToken, refreshToken);
				clearOtpState(window.sessionStorage, VERIFY_STATE_KEY);
				// Verify logs the user in. The gate decides where they land.
				await router.invalidate();
				await router.navigate({ to: "/" });
			}
		},
	});

	const submitVerify = async (
		handle: string,
		code: string,
		alreadyRetried = false,
	) => {
		setFormError(null);
		try {
			await requestVerify({ token: handle, code });
		} catch (error) {
			await handleVerifyError(error, handle, code, alreadyRetried);
		}
	};

	const handleVerifyError = async (
		error: unknown,
		usedHandle: string,
		code: string,
		alreadyRetried: boolean,
	) => {
		if (!isErrorResponse(error)) {
			setFormError(error instanceof Error ? error.message : String(error));
			return;
		}
		if (Array.isArray(error.details) && error.details.length > 0) {
			handleFormikError(error, formik);
			return;
		}
		const message = authErrorMessage(error);
		const action = verifyErrorAction(error.code, {
			hasSession: getAccessToken() !== null,
		});
		switch (action) {
			case "stay":
			case "resend":
				setFormError(message);
				return;
			case "use-latest-handle": {
				const latest = loadState();
				if (latest?.token && latest.token !== usedHandle && !alreadyRetried) {
					setState(latest);
					await submitVerify(latest.token, code, true);
					return;
				}
				setFormError(message);
				return;
			}
			case "restart-signup":
				clearOtpState(window.sessionStorage, VERIFY_STATE_KEY);
				toast.info(message);
				await navigate({ to: "/auth/signup" });
				return;
			case "continue":
				clearOtpState(window.sessionStorage, VERIFY_STATE_KEY);
				await router.invalidate();
				await navigate({ to: "/" });
				return;
			case "login":
				clearOtpState(window.sessionStorage, VERIFY_STATE_KEY);
				toast.info(message);
				await navigate({ to: "/auth/login" });
				return;
		}
	};

	const formik = useFormik({
		initialValues: {
			email: state?.email ?? "",
			code: prefillCode(state, import.meta.env.DEV),
		},
		enableReinitialize: true,
		validationSchema: validationSchema.verifyEmail,
		onSubmit: async (values) => {
			if (!token) return;
			await submitVerify(token, values.code);
		},
	});

	const handleResend = async () => {
		const email = formik.values.email;
		if (!email) return;
		setFormError(null);
		try {
			const res = await requestResend({ email });
			// A 200 is always success. A present token replaces the handle, even
			// inside the cooldown; an absent one keeps the handle already held.
			const payload = res?.data;
			if (!payload) return;
			const next = otpStateFromResponse({
				email,
				response: payload,
				nowMs: Date.now(),
				previous: state ?? undefined,
			});
			writeOtpState(window.sessionStorage, VERIFY_STATE_KEY, next);
			setState(next);
			formik.setFieldValue("code", prefillCode(next, import.meta.env.DEV));
		} catch (error) {
			setFormError(
				isErrorResponse(error)
					? authErrorMessage(error)
					: error instanceof Error
						? error.message
						: String(error),
			);
		}
	};

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
					autoComplete="one-time-code"
					icon={<SquareAsteriskIcon size={15} />}
				/>

				{formError ? <AuthFormError>{formError}</AuthFormError> : null}

				{token ? null : (
					<p className="text-body-md text-muted-foreground">
						{t("verifyEmail.noHandle")}
					</p>
				)}

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
