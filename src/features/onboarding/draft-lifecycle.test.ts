import { describe, expect, it } from "vitest";
import { clearDraftWhenDone, shouldClearDraft } from "./draft-lifecycle";
import {
	loadDraft,
	type StorageLike,
	saveDraftSection,
} from "./onboarding-draft";

function memoryStorage(): StorageLike {
	const data = new Map<string, string>();
	return {
		getItem: (key) => data.get(key) ?? null,
		setItem: (key, value) => {
			data.set(key, value);
		},
		removeItem: (key) => {
			data.delete(key);
		},
	};
}

describe("shouldClearDraft", () => {
	it("clears once the Advertiser is approved or rejected", () => {
		expect(shouldClearDraft("APPROVED")).toBe(true);
		expect(shouldClearDraft("REJECTED")).toBe(true);
	});

	it("keeps the draft for every status where the form may still be used or come back", () => {
		for (const status of [
			"REGISTERED",
			"IN_PROGRESS",
			"PENDING_REVIEW",
			"NEEDS_CHANGES",
			"SUSPENDED",
		] as const) {
			expect(shouldClearDraft(status)).toBe(false);
		}
	});
});

describe("clearDraftWhenDone", () => {
	const contact = {
		firstName: "Jane",
		lastName: "Doe",
		mobile: "1",
		title: "",
	};

	it("removes the draft on APPROVED", () => {
		const storage = memoryStorage();
		saveDraftSection(storage, "u1", "contact", contact);
		clearDraftWhenDone(storage, "u1", "APPROVED");
		expect(loadDraft(storage, "u1")).toEqual({});
	});

	it("removes the draft on REJECTED", () => {
		const storage = memoryStorage();
		saveDraftSection(storage, "u1", "contact", contact);
		clearDraftWhenDone(storage, "u1", "REJECTED");
		expect(loadDraft(storage, "u1")).toEqual({});
	});

	it("leaves the draft while the Advertiser is waiting for review", () => {
		const storage = memoryStorage();
		saveDraftSection(storage, "u1", "contact", contact);
		clearDraftWhenDone(storage, "u1", "PENDING_REVIEW");
		expect(loadDraft(storage, "u1")).toEqual({ contact });
	});
});
