/** Smallest Point Zone: below this it is a pin, not a Zone. */
export const ZONE_MIN_RADIUS_METERS = 50;
/** Largest Point Zone: beyond this it is a city, not a Zone. */
export const ZONE_MAX_RADIUS_METERS = 50_000;

const METERS_PER_KILOMETER = 1000;

/** Kilometer bounds shown on the map. They match 50 and 50,000 meters. */
export const ZONE_MIN_RADIUS_KM = ZONE_MIN_RADIUS_METERS / METERS_PER_KILOMETER;
export const ZONE_MAX_RADIUS_KM = ZONE_MAX_RADIUS_METERS / METERS_PER_KILOMETER;

/**
 * Converts the kilometer radius shown in the map UI into `radiusMeters`.
 * Returns undefined when the result is outside 50 to 50,000 meters.
 */
export function radiusMetersFromKilometers(
	radiusKm: number,
): number | undefined {
	if (!Number.isFinite(radiusKm)) {
		return undefined;
	}
	const radiusMeters = Math.round(radiusKm * METERS_PER_KILOMETER);
	if (
		radiusMeters < ZONE_MIN_RADIUS_METERS ||
		radiusMeters > ZONE_MAX_RADIUS_METERS
	) {
		return undefined;
	}
	return radiusMeters;
}
