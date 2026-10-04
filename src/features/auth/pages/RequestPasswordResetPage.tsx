import { Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthShell, authLinkClass } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { requestPasswordReset } from "../api/request-password-reset";
import {
	otpStateFromResponse,
	RESET_STATE_KEY,
	readOtpState,
	writeOtpState,
} from "../otp-state";
import {
	RequestPasswordResetPayload,
	RequestPasswordResetResponse,
} from "../types";

export function RequestPasswordResetPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [email] = useState(
		() => readOtpState(window.sessionStorage, RESET_STATE_KEY)?.email ?? "",
	);

	const { request: requestReset, isLoading: isLoadingReset } = useRequest<
		RequestPasswordResetPayload,
		ServerResponse<RequestPasswordResetResponse>
	>(requestPasswordReset, {
		onSuccess: (res) => {
			const payload = res?.data;

			if (!payload) {
				return;
			}

			writeOtpState(
				window.sessionStorage,
				RESET_STATE_KEY,
				otpStateFromResponse({
					email: formik.values.email,
					response: payload,
					nowMs: Date.now(),
				}),
			);

			// Always the same words, so the screen never says whether the email exists.
			toast.success(t("passwordReset.request.sent"));
			navigate({ to: "/auth/confirm-password-reset" });
		},
	});

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
		<AuthShell
			title={t("passwordReset.request.title")}
			description={t("passwordReset.request.description")}
		>
			<form onSubmit={formik.handleSubmit} className="flex flex-col gap-stack">
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

				<p className="text-center text-body-md text-muted-foreground">
					<Link to="/auth/login" className={authLinkClass}>
						{t("passwordReset.request.backToLogin")}
					</Link>
				</p>
			</form>
		</AuthShell>
	);
}
