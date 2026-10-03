import { readAdminPassword } from "./read-admin-password";

const ADMIN_NAME_MAX_LENGTH = 100;

export type AcceptAdminInvitePayload = {
	readonly token: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly password: string;
};

export type AcceptAdminInviteFieldErrors = {
	readonly firstName?: "firstNameRequired" | "adminNameMax";
	readonly lastName?: "lastNameRequired" | "adminNameMax";
	readonly password?: "passwordRequired" | "passwordMin" | "passwordMax";
};

export type AcceptAdminInviteBuildResult =
	| { readonly ok: true; readonly payload: AcceptAdminInvitePayload }
	| { readonly ok: false; readonly fields: AcceptAdminInviteFieldErrors };

function readAdminName<T extends "firstNameRequired" | "lastNameRequired">(
	name: string,
	required: T,
): { readonly value: string; readonly problem: T | "adminNameMax" | null } {
	const value = name.trim();
	if (value.length === 0) {
		return { value, problem: required };
	}
	if (value.length > ADMIN_NAME_MAX_LENGTH) {
		return { value, problem: "adminNameMax" };
	}
	return { value, problem: null };
}

/**
 * Builds the accept-invite body. Names are trimmed. A password outside
 * 12 to 128 characters, a blank or over-long name, or a missing token
 * is refused before anything is sent.
 */
export function buildAcceptAdminInvitePayload(input: {
	readonly token: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly password: string;
}): AcceptAdminInviteBuildResult {
	const token = input.token.trim();
	const firstName = readAdminName(input.firstName, "firstNameRequired");
	const lastName = readAdminName(input.lastName, "lastNameRequired");
	const passwordProblem = readAdminPassword(input.password);
	const fields: AcceptAdminInviteFieldErrors = {
		...(firstName.problem ? { firstName: firstName.problem } : {}),
		...(lastName.problem ? { lastName: lastName.problem } : {}),
		...(passwordProblem ? { password: passwordProblem } : {}),
	};
	if (!token || firstName.problem || lastName.problem || passwordProblem) {
		return { ok: false, fields };
	}
	return {
		ok: true,
		payload: {
			token,
			firstName: firstName.value,
			lastName: lastName.value,
			password: input.password,
		},
	};
}
