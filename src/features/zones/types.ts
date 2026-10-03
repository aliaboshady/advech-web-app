/** GeoJSON Point: `[longitude, latitude]` plus `radiusMeters`. */
export type PointZoneGeometry = {
	type: "Point";
	coordinates: [number, number];
	radiusMeters: number;
};

/** A Zone from the Advertiser's library. The picker only needs id and name. */
export type Zone = {
	id: string;
	name: string;
};

export type CreatePointZonePayload = {
	name: string;
	geometry: PointZoneGeometry;
};
