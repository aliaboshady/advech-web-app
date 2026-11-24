import { Link, useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { AuthShell, authLinkClass } from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { BackendResponse } from "@/types";
import { signup } from "../api/signup";
import {
	otpStateFromResponse,
	VERIFY_STATE_KEY,
	writeOtpState,
} from "../otp-state";
import { SignupPayload, SignupResponse } from "../types";

export function SignupPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { request, isLoading, isSuccess } = useRequest<
		SignupPayload,
		BackendResponse<SignupResponse>
	>(signup, {
		onSuccess: (res) => {
			const payload = res.data;

			if (!payload) {
				return;
			}

			writeOtpState(
				window.sessionStorage,
				VERIFY_STATE_KEY,
				otpStateFromResponse({
					email: formik.values.email,
					response: payload,
					nowMs: Date.now(),
				}),
			);

			navigate({
				to: "/auth/verify-email",
			});
		},
	});

	const formik = useFormik({
		initialValues: { email: "", password: "", confirmPassword: "" },
		validationSchema: validationSchema.signup,
		onSubmit: async (values) => {
			try {
				await request({
					email: values.email,
					password: values.password,
				});
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	return (
		<AuthShell title={t("signup.title")} description={t("signup.description")}>
			<form onSubmit={formik.handleSubmit} className="flex flex-col gap-stack">
				<FormikTextInput
					formik={formik}
					label={t("login.email")}
					placeholder={t("login.emailPlaceholder")}
					name="email"
					autoComplete="username"
					icon={<MailIcon size={15} />}
				/>

				<FormikTextInput
					formik={formik}
					label={t("login.password")}
					placeholder={t("login.passwordPlaceholder")}
					name="password"
					autoComplete="current-password"
					icon={<KeyRoundIcon size={15} />}
					isPassword
				/>

				<FormikTextInput
					formik={formik}
					label={t("signup.confirmPassword")}
					placeholder={t("signup.confirmPasswordPlaceholder")}
					name="confirmPassword"
					icon={<KeyRoundIcon size={15} />}
					isPassword
				/>

				<Button
					disabled={!formik.isValid || isLoading || isSuccess}
					type="submit"
					className="w-full"
				>
					{t("signup.submit")}
				</Button>

				<p className="text-center text-body-md text-muted-foreground">
					{t("signup.alreadyAccount")}{" "}
					<Link to="/auth/login" className={authLinkClass}>
						{t("login.submit")}
					</Link>
				</p>
			</form>
		</AuthShell>
	);
}
