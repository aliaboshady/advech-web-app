export type SignupPayload = {
	email: string;
	password: string;
};

export type SignupResponse = {
	token: string;
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
	token?: string;
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	devCode?: string;
};

export type VerifyEmailPayload = {
	token: string;
	code: string;
};

export type VerifyEmailResponse = {
	accessToken: string;
	refreshToken: string;
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
