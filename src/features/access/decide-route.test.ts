import { describe, expect, it } from "vitest";
import {
	decideRoute,
	routeAreaFromPathname,
	sessionNavigation,
	signedInLeavePublic,
} from "./decide-route";

const admin = { actorType: "ADMIN" as const };
const advertiser = { actorType: "ADVERTISER" as const };

describe("decideRoute", () => {
	it("lets an Admin stay in the admin area", () => {
		expect(
			decideRoute({
				actor: admin,
				area: "admin",
				redirectTarget: "/admin/advertisers",
			}),
		).toEqual({ action: "stay" });
	});

	it("sends an Advertiser who opens the admin area to the Advertiser home", () => {
		expect(
			decideRoute({
				actor: advertiser,
				area: "admin",
				redirectTarget: "/admin/advertisers",
			}),
		).toEqual({ action: "advertiser-home" });
	});

	it("sends an Admin who opens the Advertiser area to the admin home", () => {
		expect(
			decideRoute({
				actor: admin,
				area: "advertiser",
				redirectTarget: "/campaigns",
			}),
		).toEqual({ action: "admin-home" });
	});

	it("lets an Advertiser stay in the Advertiser area", () => {
		expect(
			decideRoute({
				actor: advertiser,
				area: "advertiser",
				redirectTarget: "/campaigns",
			}),
		).toEqual({ action: "stay" });
	});

	it("sends a signed-out visitor on an admin page to the admin sign-in and keeps the target", () => {
		expect(
			decideRoute({
				actor: null,
				area: "admin",
				redirectTarget: "/admin/advertisers?status=PENDING_REVIEW",
			}),
		).toEqual({
			action: "sign-in",
			to: "/auth/admin/login",
			redirectUrl: "/admin/advertisers?status=PENDING_REVIEW",
		});
	});

	it("sends a signed-out visitor on an Advertiser page to the Advertiser sign-in and keeps the target", () => {
		expect(
			decideRoute({
				actor: null,
				area: "advertiser",
				redirectTarget: "/campaigns/42/identity",
			}),
		).toEqual({
			action: "sign-in",
			to: "/auth/login",
			redirectUrl: "/campaigns/42/identity",
		});
	});

	it("omits the redirect target when the signed-out visitor was on the Advertiser home", () => {
		expect(
			decideRoute({
				actor: null,
				area: "advertiser",
				redirectTarget: undefined,
			}),
		).toEqual({
			action: "sign-in",
			to: "/auth/login",
			redirectUrl: undefined,
		});
	});
});

describe("sessionNavigation", () => {
	it("keeps the Advertiser sign-in search shape, including an omitted target", () => {
		expect(
			sessionNavigation({
				action: "sign-in",
				to: "/auth/login",
				redirectUrl: undefined,
			}),
		).toEqual({
			kind: "to",
			to: "/auth/login",
			search: { redirectUrl: undefined },
		});
	});

	it("keeps an Advertiser redirect target on the sign-in search", () => {
		expect(
			sessionNavigation({
				action: "sign-in",
				to: "/auth/login",
				redirectUrl: "/campaigns/42/identity",
			}),
		).toEqual({
			kind: "to",
			to: "/auth/login",
			search: { redirectUrl: "/campaigns/42/identity" },
		});
	});

	it("encodes the admin sign-in target into the href", () => {
		expect(
			sessionNavigation({
				action: "sign-in",
				to: "/auth/admin/login",
				redirectUrl: "/admin/advertisers?status=PENDING_REVIEW",
			}),
		).toEqual({
			kind: "href",
			href: "/auth/admin/login?redirectUrl=%2Fadmin%2Fadvertisers%3Fstatus%3DPENDING_REVIEW",
		});
	});

	it("points the admin home at /admin", () => {
		expect(sessionNavigation({ action: "admin-home" })).toEqual({
			kind: "href",
			href: "/admin",
		});
	});
});

describe("signedInLeavePublic", () => {
	it("sends an Admin with no saved page to the admin home", () => {
		expect(
			signedInLeavePublic({ actor: admin, redirectUrl: undefined }),
		).toEqual({ kind: "href", href: "/admin" });
	});

	it("keeps an Admin's saved admin page, including its query", () => {
		expect(
			signedInLeavePublic({
				actor: admin,
				redirectUrl: "/admin/advertisers?status=PENDING_REVIEW",
			}),
		).toEqual({
			kind: "href",
			href: "/admin/advertisers?status=PENDING_REVIEW",
		});
	});

	it("sends an Admin whose saved page is an Advertiser page to the admin home", () => {
		expect(
			signedInLeavePublic({ actor: admin, redirectUrl: "/campaigns" }),
		).toEqual({ kind: "href", href: "/admin" });
	});

	it("sends an Advertiser with no saved page to the Advertiser home", () => {
		expect(
			signedInLeavePublic({ actor: advertiser, redirectUrl: undefined }),
		).toEqual({ kind: "to", to: "/" });
	});

	it("keeps an Advertiser's saved page, including its query", () => {
		expect(
			signedInLeavePublic({
				actor: advertiser,
				redirectUrl: "/campaigns?status=draft",
			}),
		).toEqual({ kind: "href", href: "/campaigns?status=draft" });
	});

	it("sends an Advertiser whose saved page is an admin page to the Advertiser home", () => {
		expect(
			signedInLeavePublic({ actor: advertiser, redirectUrl: "/admin" }),
		).toEqual({ kind: "to", to: "/" });
	});

	it("ignores a redirect that is not a same-app path", () => {
		expect(
			signedInLeavePublic({ actor: admin, redirectUrl: "//evil.example" }),
		).toEqual({ kind: "href", href: "/admin" });
	});
});

describe("routeAreaFromPathname", () => {
	it("treats the admin home and its pages as the admin area", () => {
		expect(routeAreaFromPathname("/admin")).toBe("admin");
		expect(routeAreaFromPathname("/admin/advertisers")).toBe("admin");
	});

	it("treats Advertiser pages and the admin sign-in as the Advertiser area", () => {
		expect(routeAreaFromPathname("/")).toBe("advertiser");
		expect(routeAreaFromPathname("/campaigns")).toBe("advertiser");
		expect(routeAreaFromPathname("/administrator")).toBe("advertiser");
		expect(routeAreaFromPathname("/auth/admin/login")).toBe("advertiser");
	});
});
