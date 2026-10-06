import { describe, expect, it } from "vitest";
import {
	addDraftPoint,
	DEFAULT_RADIUS_METERS,
	DraftPoint,
	draftPointLabel,
	isZoneRadiusMeters,
	removeDraftPoint,
	setDraftPointRadius,
	toCreatePointZonePayload,
} from "./draft-point";

const tower: DraftPoint = {
	id: "place-tower",
	name: "Cairo Tower",
	address: "Zamalek, Cairo",
	lat: 30.045915,
	lng: 31.224289,
	radiusMeters: DEFAULT_RADIUS_METERS,
};

const droppedPin: DraftPoint = {
	id: "click-30.1-31.2",
	name: "",
	lat: 30.1,
	lng: 31.2,
	radiusMeters: DEFAULT_RADIUS_METERS,
};

describe("addDraftPoint", () => {
	it("appends a new point", () => {
		expect(addDraftPoint([tower], droppedPin)).toEqual([tower, droppedPin]);
	});

	it("ignores a point that is already dropped", () => {
		const points = [tower];
		expect(addDraftPoint(points, { ...tower, radiusMeters: 900 })).toBe(points);
	});
});

describe("setDraftPointRadius", () => {
	it("changes only the matching point", () => {
		expect(
			setDraftPointRadius([tower, droppedPin], droppedPin.id, 750),
		).toEqual([tower, { ...droppedPin, radiusMeters: 750 }]);
	});

	it("keeps the old radius when the new one is outside a Zone's range", () => {
		const points = [tower];
		expect(setDraftPointRadius(points, tower.id, 49)).toBe(points);
		expect(setDraftPointRadius(points, tower.id, 50_001)).toBe(points);
	});
});

describe("isZoneRadiusMeters", () => {
	it("accepts whole meters from 50 to 50,000", () => {
		expect(isZoneRadiusMeters(50)).toBe(true);
		expect(isZoneRadiusMeters(50_000)).toBe(true);
		expect(isZoneRadiusMeters(49)).toBe(false);
		expect(isZoneRadiusMeters(50_001)).toBe(false);
		expect(isZoneRadiusMeters(120.5)).toBe(false);
		expect(isZoneRadiusMeters(Number.NaN)).toBe(false);
	});
});

describe("removeDraftPoint", () => {
	it("drops the matching point", () => {
		expect(removeDraftPoint([tower, droppedPin], tower.id)).toEqual([
			droppedPin,
		]);
	});
});

describe("draftPointLabel", () => {
	it("prefers the place name, then the address, then the coordinates", () => {
		expect(draftPointLabel(tower)).toBe("Cairo Tower");
		expect(draftPointLabel({ ...droppedPin, address: "Nasr City" })).toBe(
			"Nasr City",
		);
		expect(draftPointLabel(droppedPin)).toBe("30.10000, 31.20000");
	});
});

describe("toCreatePointZonePayload", () => {
	it("names the Zone after the point and sends GeoJSON order", () => {
		expect(toCreatePointZonePayload(tower)).toEqual({
			name: "Cairo Tower",
			geometry: {
				type: "Point",
				coordinates: [31.224289, 30.045915],
				radiusMeters: DEFAULT_RADIUS_METERS,
			},
		});
	});

	it("cuts a long name to the Zone name limit", () => {
		const payload = toCreatePointZonePayload({
			...tower,
			name: "x".repeat(200),
		});
		expect(payload.name).toHaveLength(120);
	});

	it("falls back to the coordinates when the name is too short", () => {
		expect(toCreatePointZonePayload({ ...tower, name: "A" }).name).toBe(
			"30.04592, 31.22429",
		);
	});
});
