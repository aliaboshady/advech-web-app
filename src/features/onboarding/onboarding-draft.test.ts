import { describe, expect, it } from "vitest";
import {
	clearDraft,
	draftKey,
	loadDraft,
	type StorageLike,
	saveDraftSection,
} from "./onboarding-draft";

function memoryStorage(): StorageLike & { data: Map<string, string> } {
	const data = new Map<string, string>();
	return {
		data,
		getItem: (key) => data.get(key) ?? null,
		setItem: (key, value) => {
			data.set(key, value);
		},
		removeItem: (key) => {
			data.delete(key);
		},
	};
}

const company = {
	name: "Acme Media Ltd",
	email: "info@acme.com",
	country: "Egypt",
	countryCode: "EG",
	city: "Cairo",
	telephone: "+20221234567",
	address: "",
};

describe("onboarding draft", () => {
	it("starts blank when nothing was typed", () => {
		expect(loadDraft(memoryStorage(), "user-1")).toEqual({});
	});

	it("restores what was typed for the same user", () => {
		const storage = memoryStorage();
		saveDraftSection(storage, "user-1", "company", company);
		expect(loadDraft(storage, "user-1")).toEqual({ company });
	});

	it("keeps each user's draft apart", () => {
		const storage = memoryStorage();
		saveDraftSection(storage, "user-1", "company", company);
		expect(loadDraft(storage, "user-2")).toEqual({});
		expect(draftKey("user-1")).not.toBe(draftKey("user-2"));
	});

	it("saves a section without losing the other one", () => {
		const storage = memoryStorage();
		const contact = {
			firstName: "Jane",
			lastName: "Doe",
			mobile: "+201001234567",
			title: "",
		};
		saveDraftSection(storage, "user-1", "company", company);
		saveDraftSection(storage, "user-1", "contact", contact);
		expect(loadDraft(storage, "user-1")).toEqual({ company, contact });
	});

	it("clears a user's draft", () => {
		const storage = memoryStorage();
		saveDraftSection(storage, "user-1", "company", company);
		clearDraft(storage, "user-1");
		expect(loadDraft(storage, "user-1")).toEqual({});
	});

	it("ignores a draft that is not valid JSON", () => {
		const storage = memoryStorage();
		storage.setItem(draftKey("user-1"), "{not json");
		expect(loadDraft(storage, "user-1")).toEqual({});
	});

	it("keeps only known text fields, so nothing else is ever restored", () => {
		const storage = memoryStorage();
		storage.setItem(
			draftKey("user-1"),
			JSON.stringify({
				company: { name: "Acme", password: "S3cure", telephone: 42 },
				contact: "nope",
				code: "123456",
			}),
		);
		expect(loadDraft(storage, "user-1")).toEqual({ company: { name: "Acme" } });
	});

	it("never throws when storage is unavailable", () => {
		const broken: StorageLike = {
			getItem: () => {
				throw new Error("blocked");
			},
			setItem: () => {
				throw new Error("full");
			},
			removeItem: () => {
				throw new Error("blocked");
			},
		};
		expect(loadDraft(broken, "user-1")).toEqual({});
		expect(() =>
			saveDraftSection(broken, "user-1", "company", company),
		).not.toThrow();
		expect(() => clearDraft(broken, "user-1")).not.toThrow();
	});
});
