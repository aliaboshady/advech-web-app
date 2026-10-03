import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy } from "react";

// Development-only reference page. `import.meta.env.DEV` is replaced at build
// time, so the page (and its dynamic import) is dropped from production builds
// and the route answers with the not-found page.
const DesignSystemPage = import.meta.env.DEV
	? lazy(() => import("@/features/design-system/pages/DesignSystemPage"))
	: () => null;

export const Route = createFileRoute("/design-system")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) {
			throw notFound();
		}
	},
	component: DesignSystemPage,
});
