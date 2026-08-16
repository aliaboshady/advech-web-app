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

export function LoginPage() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		console.log(form);
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

						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
