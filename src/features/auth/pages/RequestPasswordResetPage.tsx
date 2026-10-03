import { Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthShell, authLinkClass } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { requestPasswordReset } from "../api/request-password-reset";
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
