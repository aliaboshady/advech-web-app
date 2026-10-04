import {
	getRouteApi,
	Link,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useFormik } from "formik";
import { KeyRoundIcon, MailIcon } from "lucide-react";
import { useTopLoader } from "nextjs-toploader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import {
	AuthFormError,
	AuthShell,
	authLinkClass,
} from "@/features/auth/components/AuthShell";
import useRequest from "@/hooks/useRequest";
import { saveTokens } from "@/lib/tokenUtils";
import { handleFormikError, isErrorResponse } from "@/lib/utils";
import { validationSchema } from "@/lib/validation";
import { ServerResponse } from "@/types";
import { login } from "../api/login";
import { resendCode } from "../api/resend-code";
import { authErrorMessage } from "../auth-error-message";
import { loginErrorAction } from "../login-error-action";
import {
	otpStateFromResponse,
	readOtpState,
	VERIFY_STATE_KEY,
	writeOtpState,
} from "../otp-state";
import { LoginPayload, LoginResponse } from "../types";

const loginRoute = getRouteApi("/_public/auth/login");

function getSafeRedirectUrl(redirectUrl: string | undefined): string {
	return redirectUrl?.startsWith("/") && !redirectUrl.startsWith("//")
		? redirectUrl
		: "/";
}

/** The verify state already held for this email, so an absent `token` keeps its handle. */
function heldHandleFor(email: string) {
	const held = readOtpState(window.sessionStorage, VERIFY_STATE_KEY);
	return held?.email === email ? held : undefined;
}

export function LoginPage() {
	const router = useRouter();
	const navigate = useNavigate();
	const [formError, setFormError] = useState<string | null>(null);
	const [isSuspended, setIsSuspended] = useState(false);
	const { redirectUrl } = loginRoute.useSearch();
	const { t } = useTranslation();
	const { start: startTopLoader } = useTopLoader();

	const { request, isLoading, isSuccess } = useRequest<
		LoginPayload,
		ServerResponse<LoginResponse>
	>(login, {
		// The screen shows the message itself, next to the form.
		showErrorToast: false,
		onSuccess: async (res: ServerResponse<LoginResponse>) => {
			const { refreshToken, accessToken } = res?.data ?? {};
			if (refreshToken && accessToken) {
				startTopLoader();
				saveTokens(accessToken, refreshToken);
				await router.invalidate();
				// The gate decides where an Advertiser lands, from Onboarding state.
				await router.navigate({ to: getSafeRedirectUrl(redirectUrl) });
			}
		},
	});

	/**
	 * The email is not verified. Login returns no handle, so ask resend for one,
	 * keep it, and open the verify screen.
	 */
	const bounceToVerify = async (email: string) => {
		const res = await resendCode({ email });
		if (res.error || !res.data) {
			setFormError(res.error ? authErrorMessage(res.error) : null);
			return;
		}
		writeOtpState(
			window.sessionStorage,
			VERIFY_STATE_KEY,
			otpStateFromResponse({
				email,
				response: res.data,
				nowMs: Date.now(),
				previous: heldHandleFor(email),
			}),
		);
		await navigate({ to: "/auth/verify-email" });
	};

	const handleLoginError = async (error: unknown, email: string) => {
		if (!isErrorResponse(error)) {
			setFormError(error instanceof Error ? error.message : String(error));
			return;
		}
		if (Array.isArray(error.details) && error.details.length > 0) {
			handleFormikError(error, formik);
			return;
		}
		const action = loginErrorAction(error.code);
		if (action === "verify") {
			await bounceToVerify(email);
		} else if (action === "suspended") {
			setIsSuspended(true);
		} else {
			setFormError(authErrorMessage(error));
		}
	};

	const formik = useFormik({
		initialValues: { email: "", password: "" },
		validationSchema: validationSchema.login,
		onSubmit: async (values) => {
			setFormError(null);
			setIsSuspended(false);
			try {
				await request({
					email: values.email,
					password: values.password,
				});
			} catch (error) {
				await handleLoginError(error, values.email);
			}
		},
	});

	return (
		<AuthShell title={t("login.title")} description={t("login.description")}>
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

				{isSuspended ? (
					<AuthFormError>{t("login.suspended")}</AuthFormError>
				) : null}
				{formError ? <AuthFormError>{formError}</AuthFormError> : null}

				<p className="text-end text-body-md text-muted-foreground">
					<Link to="/auth/request-password-reset" className={authLinkClass}>
						{t("login.forgotPassword")}
					</Link>
				</p>

				<Button
					type="submit"
					className="w-full"
					disabled={!formik.isValid || isLoading || isSuccess}
				>
					{isLoading ? t("login.submitting") : t("login.submit")}
				</Button>

				<p className="text-center text-body-md text-muted-foreground">
					{t("login.noAccount")}{" "}
					<Link to="/auth/signup" className={authLinkClass}>
						{t("login.createAccount")}
					</Link>
				</p>
			</form>
		</AuthShell>
	);
}
