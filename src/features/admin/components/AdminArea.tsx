import {
	Outlet,
	useRouteContext,
	useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { adminMayOpenPath } from "@/features/access/admin-sidebar";
import { clearPermissionDenied } from "@/features/access/permission-denied-state";
import { usePermissionDenied } from "@/features/access/use-permission-denied";
import { AdminNoAccess } from "./AdminNoAccess";

/** Admin pages. A refused action shows no access until this page is open again. */
export function AdminArea() {
	const { me } = useRouteContext({ from: "__root__" });
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const isDenied = usePermissionDenied();
	const previousPathname = useRef(pathname);
	const accessAtDenial = useRef(me);
	useEffect(() => {
		if (previousPathname.current !== pathname) {
			previousPathname.current = pathname;
			accessAtDenial.current = me;
			clearPermissionDenied();
			return;
		}
		if (!isDenied) {
			accessAtDenial.current = me;
			return;
		}
		if (me === accessAtDenial.current) {
			return;
		}
		if (adminMayOpenPath(me?.access ?? null, pathname)) {
			clearPermissionDenied();
		}
	}, [isDenied, me, pathname]);
	if (isDenied) {
		return <AdminNoAccess reason="permission-denied" />;
	}
	return <Outlet />;
}
