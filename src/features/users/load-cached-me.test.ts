import { beforeEach, describe, expect, it } from "vitest";
import { clearCachedMe, loadCachedMe } from "./load-cached-me";
import { User } from "./types";

const advertiser: User = {
	id: "user-1",
	phone: "01234567890",
	email: "ada@example.com",
	firstName: "Ada",
	lastName: "Advertiser",
	imagePath: "",
	status: "ACTIVE",
	createdAt: "2026-09-02T18:13:47.591Z",
	updatedAt: "2026-09-02T18:13:47.591Z",
	actorType: "ADVERTISER",
	access: null,
};

describe("loadCachedMe", () => {
	beforeEach(() => {
		clearCachedMe();
	});

	it("reuses me while the access token is unchanged", async () => {
		let fetches = 0;
		const fetchMe = async (): Promise<User | null> => {
			fetches += 1;
			return advertiser;
		};
		await loadCachedMe("token-a", fetchMe);
		const second = await loadCachedMe("token-a", fetchMe);
		expect(second).toEqual(advertiser);
		expect(fetches).toBe(1);
	});

	it("fetches me again after the cache is cleared", async () => {
		let fetches = 0;
		const fetchMe = async (): Promise<User | null> => {
			fetches += 1;
			return advertiser;
		};
		await loadCachedMe("token-a", fetchMe);
		clearCachedMe();
		await loadCachedMe("token-a", fetchMe);
		expect(fetches).toBe(2);
	});

	it("fetches me again when the access token changes", async () => {
		let fetches = 0;
		const fetchMe = async (): Promise<User | null> => {
			fetches += 1;
			return advertiser;
		};
		await loadCachedMe("token-a", fetchMe);
		await loadCachedMe("token-b", fetchMe);
		expect(fetches).toBe(2);
	});
});
