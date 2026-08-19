import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import NextTopLoaderImport from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles.css";
import { useSetAtom } from "jotai";
import { meAtom } from "@/atoms/meAtom";
import { Navbar } from "@/components/Navbar";
import { getAccessToken, getUserIdFromToken } from "@/lib/tokenUtils";

const NextTopLoader =
	(NextTopLoaderImport as { default?: typeof NextTopLoaderImport }).default ??
	NextTopLoaderImport;

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const setMe = useSetAtom(meAtom);
	const accessToken = getAccessToken();
	if (accessToken) {
		const id = getUserIdFromToken(accessToken);
		setMe((prev) => ({
			...prev,
			name: id ?? "",
		}));
	}

	return (
		<>
			<NextTopLoader
				color="#000000"
				initialPosition={0.08}
				crawlSpeed={200}
				height={3}
				crawl={true}
				showSpinner={false}
				easing="ease"
				speed={200}
			/>

			<Navbar />
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
