import type { RegisteredRouter } from "@tanstack/react-router";

export const ENV_MODES = {
	dev: "development",
	prod: "production",
};

export type Route = keyof RegisteredRouter["routesByPath"];
