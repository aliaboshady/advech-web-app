import { describe, expect, it } from "vitest";
import { radiusMetersFromKilometers } from "./point-zone-radius";

describe("radiusMetersFromKilometers", () => {
	it("converts a kilometer radius into meters", () => {
		expect(radiusMetersFromKilometers(1.5)).toBe(1500);
	});

	it("accepts the bounds of 50 and 50,000 meters", () => {
		expect(radiusMetersFromKilometers(0.05)).toBe(50);
		expect(radiusMetersFromKilometers(50)).toBe(50_000);
	});

	it("rejects a radius outside 50 to 50,000 meters", () => {
		expect(radiusMetersFromKilometers(0.04)).toBeUndefined();
		expect(radiusMetersFromKilometers(50.1)).toBeUndefined();
	});
});
