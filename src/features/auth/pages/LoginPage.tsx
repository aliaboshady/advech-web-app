import { Link, useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { meAtom } from "@/atoms/meAtom";
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
import { getUserIdFromToken, saveTokens } from "@/lib/tokenUtils";
import { ServerResponse } from "@/types";
import { login } from "../api/login";
import { LoginPayload, LoginResponse } from "../types";

export function LoginPage() {
	const navigate = useNavigate();
	const setMe = useSetAtom(meAtom);
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const { request, isLoading } = useRequest<
		LoginPayload,
		ServerResponse<LoginResponse>
	>(login, {
		onSuccess: async (res: ServerResponse<LoginResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				await Promise.all([saveTokens(accessToken, refreshToken)]);
				const id = getUserIdFromToken(accessToken);
				setMe((prev) => ({
					...prev,
					name: id ?? "",
				}));
			}

			navigate({ to: "/" });
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
		await request({
			email: form.email,
			password: form.password,
		});
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Enter your information below to login to your account.
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

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Logging in..." : "Login"}
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/auth/signup"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								Create one
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
