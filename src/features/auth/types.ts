export type SignupPayload = {
	email: string;
	password: string;
};

export type SignupResponse = {
	token: string;
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	/** Present only when the server echoes OTPs (outside production). */
	devCode?: string;
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
	token?: string;
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	devCode?: string;
};

export type ConfirmPasswordResetPayload = {
	email: string;
	code: string;
	newPassword: string;
};
