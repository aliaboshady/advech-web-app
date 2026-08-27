import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { MailIcon, SquareAsteriskIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { resendCode } from "../api/resend-code";
import { verifyEmail } from "../api/verify-email";
import { LanguageAndTheme } from "../components/LanguageAndTheme";
import {
	ResendCodePayload,
	ResendCodeResponse,
	VerifyEmailPayload,
} from "../types";

type VerifyEmailLocationState = {
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

export function VerifyEmailPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [expiresIn, setExpiresIn] = useState(0);
	const [resendAvailableIn, setResendAvailableIn] = useState(0);

	const updateStoredState = (
		next: Partial<VerifyEmailLocationState> & { email?: string },
	) => {
		const storedState = {
			email: next.email ?? email,
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
	>(resendCode, {
		onStart: () => console.log("Request started"),
		onError: (err) => console.log("Request failed", err),
	});

	const { request: requestVerify, isLoading: isLoadingVerify } = useRequest<
		VerifyEmailPayload,
		void
	>(verifyEmail, {
		onStart: () => console.log("Request started"),
		onSuccess: () => {
			navigate({ to: "/auth/login" });
		},
		onError: (err) => console.log("Request failed", err),
	});

	useEffect(() => {
		const rawState = sessionStorage.getItem("verify-email-state");

		if (!rawState) {
			return;
		}

		try {
			const state = JSON.parse(rawState) as VerifyEmailLocationState;

			setEmail(state.email ?? "");
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

	const formik = useFormik({
		initialValues: { email: "", code: "" },
		validationSchema: validationSchema.verifyEmail,
		onSubmit: async (values) => {
			try {
				await requestVerify({
					email: values.email,
					code: values.code,
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
					<CardTitle>Verify your email</CardTitle>
					<CardDescription>
						Enter the email and code sent to your inbox to complete
						verification.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<FormikTextInput
							formik={formik}
							label={t("login.email")}
							placeholder={"you@example.com"}
							name="email"
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
							icon={<MailIcon size={25} className="text-primary" />}
						/>

						<FormikTextInput
							formik={formik}
							label={"Verification code"}
							placeholder={"Enter verification code"}
							name="code"
							icon={<SquareAsteriskIcon size={25} className="text-primary" />}
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
						/>

						<div className="space-y-2 rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
							<div className="flex items-center justify-between gap-2">
								<span>Code expires in</span>
								<strong className="font-medium text-foreground">
									{formatCountdown(expiresIn)}
								</strong>
							</div>
							<div className="flex items-center justify-between gap-2">
								<span>Resend available in</span>
								<strong className="font-medium text-foreground">
									{formatCountdown(resendAvailableIn)}
								</strong>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={!formik.isValid || isLoadingVerify || isLoadingResend}
						>
							{isLoadingVerify ? "Verifying..." : "Verify email"}
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
								{isLoadingResend ? "Sending..." : "Resend code"}
							</Button>
						)}

						<LanguageAndTheme />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
