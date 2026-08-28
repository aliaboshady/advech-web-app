import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	Outlet,
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
import { getAccessToken } from "@/lib/tokenUtils";

let cachedAccessToken: string | null | undefined;
let cachedMeResponse: Awaited<ReturnType<typeof me>> | undefined;

const NextTopLoader =
	(NextTopLoaderImport as { default?: typeof NextTopLoaderImport }).default ??
	NextTopLoaderImport;

export const Route = createRootRoute({
	beforeLoad: async () => {
		const accessToken = getAccessToken();
		let response: Awaited<ReturnType<typeof me>>;

		if (accessToken === cachedAccessToken && cachedMeResponse !== undefined) {
			response = cachedMeResponse;
		} else {
			response = await me();
			cachedAccessToken = accessToken;
			cachedMeResponse = response;
		}

		return {
			me: response?.data ?? null,
		};
	},
	notFoundComponent: NotFoundPage,
	component: RootComponent,
});

function RootComponent() {
	const routerStatus = useRouterState({ select: (state) => state.status });
	const { start: startTopLoader, done: doneTopLoader } = useTopLoader();

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const isDark = savedTheme
			? savedTheme === "dark"
			: window.matchMedia("(prefers-color-scheme: dark)").matches;

		document.documentElement.classList.toggle("dark", isDark);
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
