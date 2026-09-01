export type SignupPayload = {
	email: string;
	password: string;
};

export type SignupResponse = {
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	devCode: string; // TODO: Delete for later
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
};

export type ResendCodePayload = {
	email: string;
};

export type ResendCodeResponse = {
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	devCode: string;
};

export type VerifyEmailPayload = {
	email: string;
	code: string;
};

export type RequestPasswordResetPayload = {
	email: string;
};

export type RequestPasswordResetResponse = {
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	devCode: string;
};

export type ConfirmPasswordResetPayload = {
	email: string;
	code: string;
	newPassword: string;
};
