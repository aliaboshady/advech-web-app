export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
};

export type SignupPayload = {
	email: string;
	password: string;
};

export type SignupResponse = {
	expiresInSeconds: number;
	resendAvailableInSeconds: number;
	devCode: string; // TODO: Delete for later
};
