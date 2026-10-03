import { redirect } from "@tanstack/react-router";
import type { SessionNavigation } from "./decide-route";

/** Throws the router redirect for a session navigation; returns when the actor stays. */
export function redirectForNavigation(navigation: SessionNavigation): void {
	if (navigation.kind === "stay") {
		return;
	}
	if (navigation.kind === "href") {
		throw redirect({ href: navigation.href });
	}
	if (navigation.to === "/") {
		throw redirect({ to: "/" });
	}
	throw redirect({
		to: "/auth/login",
		search: navigation.search,
	});
}
