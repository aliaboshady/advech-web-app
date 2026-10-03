/** GeoJSON Point: `[longitude, latitude]` plus `radiusMeters`. */
export type PointZoneGeometry = {
	type: "Point";
	coordinates: [number, number];
	radiusMeters: number;
};

export type PolygonZoneGeometry = {
	type: "Polygon";
	coordinates: [number, number][][];
};

export type ZoneGeometry = PointZoneGeometry | PolygonZoneGeometry;

export type ZoneKind = "CIRCLE" | "POLYGON";

export type Zone = {
	id: string;
	name: string;
	kind: ZoneKind;
	geometry: ZoneGeometry;
	createdAt: string;
	updatedAt: string;
};

export type CreatePointZonePayload = {
	name: string;
	geometry: PointZoneGeometry;
};
