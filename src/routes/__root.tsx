import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import NextTopLoaderImport, { useTopLoader } from "nextjs-toploader";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles.css";
import { NotFoundPage } from "@/components/NotFoundPage";
import { me } from "@/features/users/api/me";
import { loadCachedMe } from "@/features/users/load-cached-me";
import { registerSessionRefresh } from "@/features/users/refresh-session";
import { User } from "@/features/users/types";
import { resolveBypassMe } from "@/lib/resolve-bypass-me";
import { getAccessToken } from "@/lib/tokenUtils";

async function fetchSessionUser(): Promise<User | null> {
	const response = await me();
	return response?.data ?? null;
}

const NextTopLoader =
	(NextTopLoaderImport as { default?: typeof NextTopLoaderImport }).default ??
	NextTopLoaderImport;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				title: "Advech",
			},
		],
	}),

	beforeLoad: async () => {
		const bypassAuth =
			import.meta.env.MODE === "development" &&
			import.meta.env.VITE_BYPASS_AUTH === "true";

		if (bypassAuth) {
			return {
				me: resolveBypassMe(import.meta.env.VITE_BYPASS_ACTOR),
			};
		}

		const accessToken = getAccessToken();
		const user = await loadCachedMe(accessToken, fetchSessionUser);
		return {
			me: user,
		};
	},

	notFoundComponent: NotFoundPage,
	component: RootComponent,
});

function RootComponent() {
	const router = useRouter();
	const routerStatus = useRouterState({ select: (state) => state.status });
	const { start: startTopLoader, done: doneTopLoader } = useTopLoader();
	useEffect(() => {
		registerSessionRefresh(() => {
			void router.invalidate();
		});
	}, [router]);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const isDark = savedTheme
			? savedTheme === "dark"
			: window.matchMedia("(prefers-color-scheme: dark)").matches;

		document.documentElement.classList.toggle("dark", isDark);
		document.getElementById("app-splash")?.remove();
	}, []);

	useEffect(() => {
		if (routerStatus === "pending") {
			startTopLoader();
		} else {
			doneTopLoader();
		}
	}, [routerStatus, startTopLoader, doneTopLoader]);

	return (
		<>
			<HeadContent />
			<NextTopLoader
				color="#FF5001"
				initialPosition={0.08}
				crawlSpeed={200}
				height={5}
				crawl={true}
				showSpinner={false}
				easing="ease"
				speed={200}
			/>

			<ToastContainer
				position="bottom-center"
				className="app-toast-container"
				toastClassName="app-toast"
			/>
			<Outlet />

			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
