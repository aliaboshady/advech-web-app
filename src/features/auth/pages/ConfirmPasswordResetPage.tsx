import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon, SquareAsteriskIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { BackendResponse } from "@/types";
import { confirmPasswordReset } from "../api/confirm-password-reset";
import { requestPasswordReset } from "../api/request-password-reset";
import {
	clearOtpState,
	type OtpState,
	otpStateFromResponse,
	prefillCode,
	RESET_STATE_KEY,
	readOtpState,
	writeOtpState,
} from "../otp-state";
import { formatCountdown, secondsUntil } from "../otp-timers";
import {
	ConfirmPasswordResetPayload,
	RequestPasswordResetPayload,
	RequestPasswordResetResponse,
} from "../types";
import { useNow } from "../use-now";

export function ConfirmPasswordResetPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [state, setState] = useState<OtpState | null>(() =>
		readOtpState(window.sessionStorage, RESET_STATE_KEY),
	);
	const now = useNow(
		Math.max(state?.expiresAt ?? 0, state?.resendAvailableAt ?? 0),
	);
	const expiresIn = secondsUntil(state?.expiresAt ?? 0, now);
	const resendAvailableIn = secondsUntil(state?.resendAvailableAt ?? 0, now);

	const { request: requestReset, isLoading: isLoadingReset } = useRequest<
		RequestPasswordResetPayload,
		BackendResponse<RequestPasswordResetResponse>
	>(requestPasswordReset, {});

	// A wrong, expired or exhausted code (`OTP_*`) arrives as an error and stays
	// on this screen with the same message the verify screen gives.
	const { request: requestConfirm, isLoading: isLoadingConfirm } = useRequest<
		ConfirmPasswordResetPayload,
		BackendResponse<void>
	>(confirmPasswordReset, {
		onSuccess: () => {
			clearOtpState(window.sessionStorage, RESET_STATE_KEY);
			toast.success(t("passwordReset.confirm.success"));
			navigate({ to: "/auth/login" });
		},
	});

	const formik = useFormik({
		initialValues: {
			email: state?.email ?? "",
			code: prefillCode(state, import.meta.env.DEV),
			newPassword: "",
		},
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
		const email = formik.values.email;
		if (!email) return;

		try {
			const res = await requestReset({ email });
			const payload = res?.data;

			if (!payload) return;

			const next = otpStateFromResponse({
				email,
				response: payload,
				nowMs: Date.now(),
				previous: state ?? undefined,
			});
			writeOtpState(window.sessionStorage, RESET_STATE_KEY, next);
			setState(next);
			formik.setFieldValue("code", prefillCode(next, import.meta.env.DEV));
		} catch {
			// The request hook already showed the error.
		}
	};

	return (
		<AuthShell
			title={t("passwordReset.confirm.title")}
			description={t("passwordReset.confirm.description")}
		>
			<form onSubmit={formik.handleSubmit} className="flex flex-col gap-stack">
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
					autoComplete="one-time-code"
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

				<div className="flex flex-col gap-2 rounded-md bg-muted p-3 text-body-md text-muted-foreground">
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
			</form>
		</AuthShell>
	);
}
