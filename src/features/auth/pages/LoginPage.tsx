import { Link, useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
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
import { saveTokens } from "@/lib/tokenUtils";
import { ServerResponse } from "@/types";
import { login } from "../api/login";
import { LoginPayload, LoginResponse } from "../types";

export function LoginPage() {
	const router = useRouter();

	const { request, isLoading, isSuccess } = useRequest<
		LoginPayload,
		ServerResponse<LoginResponse>
	>(login, {
		onSuccess: async (res: ServerResponse<LoginResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				saveTokens(accessToken, refreshToken);
				await router.invalidate();
				await router.navigate({
					to: "/",
				});
			}
		},
		onError: (err) => console.log("Request failed", err),
	});

	const formik = useFormik({
		initialValues: { email: "", password: "" },
		// validationSchema: validationSchema.login,
		onSubmit: async (values) => {
			await request({
				email: values.email,
				password: values.password,
			});
			// if (res?.data) {
			//   toast.success(res?.message);
			//   startTopLoader();
			//   setTimeout(() => router.push(ROUTES.root.url), 200);
			// }
		},
	});

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
					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<FormikTextInput
							formik={formik}
							label={"Email"}
							placeholder={"you@example.com"}
							name="email"
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
							icon={<MailIcon size={25} className="text-primary" />}
						/>

						<FormikTextInput
							formik={formik}
							label={"Password"}
							placeholder={"Enter your password"}
							name="password"
							icon={<KeyRoundIcon size={25} className="text-primary" />}
							labelClassName="text-lg text-primary"
							inputClassName="h-14 focus:border-primary"
							fontSize={20}
							isPassword
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={!formik.isValid || isLoading || isSuccess}
						>
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
