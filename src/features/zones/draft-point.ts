import {
	ZONE_MAX_RADIUS_METERS,
	ZONE_MIN_RADIUS_METERS,
} from "./point-zone-radius";
import { CreatePointZonePayload } from "./types";

export const DEFAULT_RADIUS_METERS = 5000;
const ZONE_NAME_MIN_LENGTH = 2;
const ZONE_NAME_MAX_LENGTH = 120;
const COORDINATE_DIGITS = 5;

/** A point dropped on the map. Saving it creates one Point Zone. */
export type DraftPoint = {
	id: string;
	/** Google place name or geocoded address; empty until it loads. */
	name: string;
	address?: string;
	lat: number;
	lng: number;
	radiusMeters: number;
};

/** Whole meters from 50 to 50,000, the range a Point Zone accepts. */
export function isZoneRadiusMeters(value: number): boolean {
	return (
		Number.isInteger(value) &&
		value >= ZONE_MIN_RADIUS_METERS &&
		value <= ZONE_MAX_RADIUS_METERS
	);
}

/** Adds a point unless one with the same id is already dropped. */
export function addDraftPoint(
	points: DraftPoint[],
	point: DraftPoint,
): DraftPoint[] {
	if (points.some((current) => current.id === point.id)) {
		return points;
	}
	return [...points, point];
}

export function updateDraftPoint(
	points: DraftPoint[],
	id: string,
	changes: Partial<Omit<DraftPoint, "id">>,
): DraftPoint[] {
	return points.map((point) =>
		point.id === id ? { ...point, ...changes } : point,
	);
}

/** Changes one point's radius. A radius outside a Zone's range is ignored. */
export function setDraftPointRadius(
	points: DraftPoint[],
	id: string,
	radiusMeters: number,
): DraftPoint[] {
	if (!isZoneRadiusMeters(radiusMeters)) {
		return points;
	}
	return updateDraftPoint(points, id, { radiusMeters });
}

export function removeDraftPoint(
	points: DraftPoint[],
	id: string,
): DraftPoint[] {
	return points.filter((point) => point.id !== id);
}

function coordinatesLabel(point: DraftPoint): string {
	return `${point.lat.toFixed(COORDINATE_DIGITS)}, ${point.lng.toFixed(COORDINATE_DIGITS)}`;
}

/** What the point is called on screen: name, else address, else coordinates. */
export function draftPointLabel(point: DraftPoint): string {
	return point.name.trim() || point.address?.trim() || coordinatesLabel(point);
}

/** The Zone saved for a point, named after it within the Zone name limits. */
export function toCreatePointZonePayload(
	point: DraftPoint,
): CreatePointZonePayload {
	const label = draftPointLabel(point).slice(0, ZONE_NAME_MAX_LENGTH).trim();
	return {
		name:
			label.length >= ZONE_NAME_MIN_LENGTH ? label : coordinatesLabel(point),
		geometry: {
			type: "Point",
			coordinates: [point.lng, point.lat],
			radiusMeters: point.radiusMeters,
		},
	};
}
