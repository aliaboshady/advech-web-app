import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRequest from "@/hooks/useRequest";
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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!email || !code) return;

		await requestVerify({ email, code });
	};

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
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@example.com"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="code">Verification code</Label>
							<Input
								id="code"
								name="code"
								value={code}
								onChange={(event) => setCode(event.target.value)}
								placeholder="Enter code"
							/>
						</div>

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

						<Button type="submit" className="w-full" disabled={isLoadingVerify}>
							{isLoadingVerify ? "Verifying..." : "Verify email"}
						</Button>

						{resendAvailableIn <= 0 && (
							<Button
								type="button"
								variant="outline"
								className="w-full"
								disabled={isLoadingResend || !email}
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
