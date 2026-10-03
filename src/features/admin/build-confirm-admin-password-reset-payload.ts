import { readAdminPassword } from "./read-admin-password";

export type ConfirmAdminPasswordResetPayload = {
	readonly token: string;
	readonly password: string;
};

export type ConfirmAdminPasswordResetFieldErrors = {
	readonly password?: "passwordRequired" | "passwordMin" | "passwordMax";
};

export type ConfirmAdminPasswordResetBuildResult =
	| { readonly ok: true; readonly payload: ConfirmAdminPasswordResetPayload }
	| {
			readonly ok: false;
			readonly fields: ConfirmAdminPasswordResetFieldErrors;
	  };

/**
 * Builds the confirm-reset body. A password outside 12 to 128 characters,
 * or a missing token, is refused before anything is sent.
 */
export function buildConfirmAdminPasswordResetPayload(input: {
	readonly token: string;
	readonly password: string;
}): ConfirmAdminPasswordResetBuildResult {
	const token = input.token.trim();
	const passwordProblem = readAdminPassword(input.password);
	if (!token || passwordProblem) {
		return {
			ok: false,
			fields: passwordProblem ? { password: passwordProblem } : {},
		};
	}
	return {
		ok: true,
		payload: { token, password: input.password },
	};
}
