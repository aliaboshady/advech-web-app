export const ADVERTISER_HOME = "/";
export const ADMIN_HOME = "/admin";
export const ADVERTISER_SIGN_IN = "/auth/login";
export const ADMIN_SIGN_IN = "/auth/admin/login";

const ADMIN_PATH_PREFIX = "/admin";

export type RouteArea = "advertiser" | "admin";

export type RouteActor = {
	readonly actorType: "DRIVER" | "ADMIN" | "ADVERTISER";
} | null;

export type DecideRouteInput = {
	readonly actor: RouteActor;
	readonly area: RouteArea;
	readonly redirectTarget: string | undefined;
};

export type RouteDecision =
	| { readonly action: "stay" }
	| { readonly action: "advertiser-home" }
	| { readonly action: "admin-home" }
	| {
			readonly action: "sign-in";
			readonly to: typeof ADVERTISER_SIGN_IN | typeof ADMIN_SIGN_IN;
			readonly redirectUrl: string | undefined;
	  };

/** Admin pages live under `/admin`. The admin sign-in does not. */
export function routeAreaFromPathname(pathname: string): RouteArea {
	if (
		pathname === ADMIN_PATH_PREFIX ||
		pathname.startsWith(`${ADMIN_PATH_PREFIX}/`)
	) {
		return "admin";
	}
	return "advertiser";
}

/**
 * Where this actor should go for a route area.
 * Signed-out visitors keep `redirectTarget` so sign-in can return them.
 */
export function decideRoute(input: DecideRouteInput): RouteDecision {
	if (input.actor === null) {
		return {
			action: "sign-in",
			to: input.area === "admin" ? ADMIN_SIGN_IN : ADVERTISER_SIGN_IN,
			redirectUrl: input.redirectTarget,
		};
	}
	const isAdmin = input.actor.actorType === "ADMIN";
	if (input.area === "admin") {
		return isAdmin ? { action: "stay" } : { action: "advertiser-home" };
	}
	return isAdmin ? { action: "admin-home" } : { action: "stay" };
}

export type SessionNavigation =
	| { readonly kind: "stay" }
	| { readonly kind: "to"; readonly to: typeof ADVERTISER_HOME }
	| {
			readonly kind: "to";
			readonly to: typeof ADVERTISER_SIGN_IN;
			readonly search: { readonly redirectUrl: string | undefined };
	  }
	| { readonly kind: "href"; readonly href: string };

/** Turns a routing decision into the navigation the router can perform. */
export function sessionNavigation(decision: RouteDecision): SessionNavigation {
	if (decision.action === "stay") {
		return { kind: "stay" };
	}
	if (decision.action === "advertiser-home") {
		return { kind: "to", to: ADVERTISER_HOME };
	}
	if (decision.action === "admin-home") {
		return { kind: "href", href: ADMIN_HOME };
	}
	if (decision.to === ADVERTISER_SIGN_IN) {
		return {
			kind: "to",
			to: ADVERTISER_SIGN_IN,
			search: { redirectUrl: decision.redirectUrl },
		};
	}
	return { kind: "href", href: signInHref(decision.to, decision.redirectUrl) };
}

function pathnameFromRedirect(redirectUrl: string): string {
	const withoutHash = redirectUrl.split("#")[0] ?? redirectUrl;
	return withoutHash.split("?")[0] ?? withoutHash;
}

function isSafeRedirect(
	redirectUrl: string | undefined,
): redirectUrl is string {
	return Boolean(redirectUrl?.startsWith("/") && !redirectUrl.startsWith("//"));
}

/**
 * Where a signed-in actor goes when they are on a public page.
 * A saved target is kept only when they may stay in that area.
 * An Admin otherwise goes to the admin home.
 */
export function signedInLeavePublic(input: {
	readonly actor: Exclude<RouteActor, null>;
	readonly redirectUrl: string | undefined;
}): SessionNavigation {
	const redirectUrl = isSafeRedirect(input.redirectUrl)
		? input.redirectUrl
		: undefined;
	if (redirectUrl !== undefined) {
		const decision = decideRoute({
			actor: input.actor,
			area: routeAreaFromPathname(pathnameFromRedirect(redirectUrl)),
			redirectTarget: redirectUrl,
		});
		if (decision.action === "stay") {
			return { kind: "href", href: redirectUrl };
		}
		return sessionNavigation(decision);
	}
	const decision = decideRoute({
		actor: input.actor,
		area: "advertiser",
		redirectTarget: undefined,
	});
	if (decision.action === "stay") {
		return { kind: "to", to: ADVERTISER_HOME };
	}
	return sessionNavigation(decision);
}

function signInHref(path: string, redirectUrl: string | undefined): string {
	if (redirectUrl === undefined) {
		return path;
	}
	return `${path}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
}
