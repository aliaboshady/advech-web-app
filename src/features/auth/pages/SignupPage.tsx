import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { signup } from "../api/signup";
import { LanguageAndTheme } from "../components/LanguageAndTheme";
import { SignupPayload, SignupResponse } from "../types";

export function SignupPage() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { request, isLoading } = useRequest<
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
				email: form.email,
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

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const res = await request({
			email: form.email,
			password: form.password,
		});

		console.log(res);
		console.log(form);
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your information below to create your account.
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
								value={form.email}
								onChange={handleChange}
								placeholder="you@example.com"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								value={form.password}
								onChange={handleChange}
								placeholder="••••••••"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								value={form.confirmPassword}
								onChange={handleChange}
								placeholder="••••••••"
							/>
						</div>

						<Button disabled={isLoading} type="submit" className="w-full">
							Create account
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								to="/auth/login"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								Login
							</Link>
						</p>

						<LanguageAndTheme />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
