import { Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { clearPermissionDenied } from "@/features/access/permission-denied-state";
import { usePermissionDenied } from "@/features/access/use-permission-denied";
import { AdminNoAccess } from "./AdminNoAccess";

/** Admin pages. A permission-denied response replaces the page with no access. */
export function AdminArea() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const isDenied = usePermissionDenied();
	const previousPathname = useRef(pathname);
	useEffect(() => {
		if (previousPathname.current === pathname) {
			return;
		}
		previousPathname.current = pathname;
		clearPermissionDenied();
	}, [pathname]);
	if (isDenied) {
		return <AdminNoAccess reason="permission-denied" />;
	}
	return <Outlet />;
}
