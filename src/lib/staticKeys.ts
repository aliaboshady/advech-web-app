export const ENV_MODES = {
	dev: "development",
	prod: "production",
};

export type RoutesType = Record<string, { url: string; displayName: string }>;

export const ROUTES = {
	root: { url: "/", displayName: "DASHBOARD" },
	login: { url: "/login", displayName: "LOGIN" },
	admins: { url: "/admins", displayName: "ADMINS" },
	beneficiaries: { url: "/beneficiaries", displayName: "BENEFICIARIES" },
	sessions: { url: "/sessions", displayName: "SESSIONS" },
	sessionCreate: { url: "/sessions/create", displayName: "ADD_SESSION" },
	section: { url: "/section", displayName: "SECTION" },
	projects: { url: "/projects", displayName: "PROJECTS" },
	employmentItems: {
		url: "/employment-items",
		displayName: "EMPLOYMENT_ITEMS",
	},
	settings: { url: "/settings", displayName: "SETTINGS" },
	template: { url: "/template", displayName: "TEMPLATE_EDITOR" },
};
