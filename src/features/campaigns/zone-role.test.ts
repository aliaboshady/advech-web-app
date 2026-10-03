import { describe, expect, it } from "vitest";
import {
	hasZoneRoleContradiction,
	idsWithoutContradiction,
	optionsForSide,
} from "./zone-role";

const zones = [
	{ id: "a", name: "A" },
	{ id: "b", name: "B" },
	{ id: "c", name: "C" },
];

describe("hasZoneRoleContradiction", () => {
	it("is true when a Zone is on both sides", () => {
		expect(hasZoneRoleContradiction(["a", "b"], ["b"])).toBe(true);
	});

	it("is false when the sides are disjoint", () => {
		expect(hasZoneRoleContradiction(["a"], ["b"])).toBe(false);
		expect(hasZoneRoleContradiction([], [])).toBe(false);
	});
});

describe("optionsForSide", () => {
	it("hides Zones picked on the other side", () => {
		expect(optionsForSide(zones, [], ["b"]).map((zone) => zone.id)).toEqual([
			"a",
			"c",
		]);
	});

	it("keeps this side's own picks even if the other side has them", () => {
		expect(optionsForSide(zones, ["b"], ["b"]).map((zone) => zone.id)).toEqual([
			"a",
			"b",
			"c",
		]);
	});
});

describe("idsWithoutContradiction", () => {
	it("drops ids already picked on the other side", () => {
		expect(idsWithoutContradiction(["a", "b", "c"], ["b"])).toEqual(["a", "c"]);
	});

	it("keeps every id when the other side is empty", () => {
		expect(idsWithoutContradiction(["a", "b"], [])).toEqual(["a", "b"]);
	});
});
