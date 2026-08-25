import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import NextTopLoaderImport from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles.css";
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
			console.log("[auth] Reusing cached users/me response for route context");
			response = cachedMeResponse;
		} else {
			console.log("[auth] Loading users/me for route context");
			response = await me();
			cachedAccessToken = accessToken;
			cachedMeResponse = response;
		}

		return {
			me: response?.data ?? null,
		};
	},

	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<NextTopLoader
				color="#FF5001"
				initialPosition={0.08}
				crawlSpeed={200}
				height={3}
				crawl={true}
				showSpinner={false}
				easing="ease"
				speed={200}
			/>

			<ToastContainer />
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
