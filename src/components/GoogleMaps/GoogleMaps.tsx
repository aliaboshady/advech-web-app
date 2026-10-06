import {
	APIProvider,
	Map as AppMap,
	type MapMouseEvent,
} from "@vis.gl/react-google-maps";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Switch from "../inputs/Switch";
import { Slider } from "../ui/slider";
import { MapMarker } from "./MapMarker";
import { SearchBox } from "./SearchBox";
import { SearchController } from "./SearchController";
import { useMapTheme } from "./use-map-theme";

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
const EARTH_RADIUS_METERS = 6371000;
const STATIONARY_MARKER_RADIUS_KM = 0.1;

export type Place = {
	id: string;
	name: string;
	address?: string;
	lat: number;
	lng: number;
};

type Point = { x: number; y: number };

const calculateCoveredAreaKm2 = (places: Place[], radiusKm: number) => {
	if (places.length === 0) return 0;

	const referenceLatitude =
		places.reduce((sum, place) => sum + place.lat, 0) / places.length;
	const referenceLongitude =
		places.reduce((sum, place) => sum + place.lng, 0) / places.length;
	const latitudeScale = (Math.PI * EARTH_RADIUS_METERS) / 180;
	const longitudeScale =
		latitudeScale * Math.cos((referenceLatitude * Math.PI) / 180);
	const radiusMeters = radiusKm * 1000;
	const circles = places.map<Point>((place) => ({
		x: (place.lng - referenceLongitude) * longitudeScale,
		y: (place.lat - referenceLatitude) * latitudeScale,
	}));

	let areaSquareMeters = 0;

	for (let circleIndex = 0; circleIndex < circles.length; circleIndex += 1) {
		const circle = circles[circleIndex];
		const intersectionAngles = [0, 2 * Math.PI];

		for (let otherIndex = 0; otherIndex < circles.length; otherIndex += 1) {
			if (circleIndex === otherIndex) continue;

			const other = circles[otherIndex];
			const deltaX = other.x - circle.x;
			const deltaY = other.y - circle.y;
			const distance = Math.hypot(deltaX, deltaY);

			if (distance === 0 || distance >= radiusMeters * 2) continue;

			const centerAngle = Math.atan2(deltaY, deltaX);
			const intersectionOffset = Math.acos(distance / (2 * radiusMeters));
			intersectionAngles.push(
				(centerAngle - intersectionOffset + 2 * Math.PI) % (2 * Math.PI),
				(centerAngle + intersectionOffset) % (2 * Math.PI),
			);
		}

		intersectionAngles.sort((first, second) => first - second);

		for (
			let angleIndex = 0;
			angleIndex < intersectionAngles.length - 1;
			angleIndex += 1
		) {
			const startAngle = intersectionAngles[angleIndex];
			const endAngle = intersectionAngles[angleIndex + 1];
			const middleAngle = (startAngle + endAngle) / 2;
			const middlePoint = {
				x: circle.x + radiusMeters * Math.cos(middleAngle),
				y: circle.y + radiusMeters * Math.sin(middleAngle),
			};
			const isCoveredByAnotherCircle = circles.some((other, otherIndex) => {
				if (otherIndex === circleIndex) return false;

				return (
					Math.hypot(middlePoint.x - other.x, middlePoint.y - other.y) <
					radiusMeters
				);
			});

			if (isCoveredByAnotherCircle) continue;

			const startPoint = {
				x: circle.x + radiusMeters * Math.cos(startAngle),
				y: circle.y + radiusMeters * Math.sin(startAngle),
			};
			const endPoint = {
				x: circle.x + radiusMeters * Math.cos(endAngle),
				y: circle.y + radiusMeters * Math.sin(endAngle),
			};
			areaSquareMeters +=
				(radiusMeters ** 2 * (endAngle - startAngle) +
					startPoint.x * endPoint.y -
					startPoint.y * endPoint.x) /
				2;
		}
	}

	return Math.abs(areaSquareMeters) / 1_000_000;
};

type Props = {
	className?: string;
	markerRadiusKm?: number;
	onMarkerRadiusKmChange?: (radiusKm: number) => void;
	onCoverageAreaChange?: (areaKm2: number) => void;
	onMovementChange?: (isMoving: boolean) => void;
	isMoving?: boolean;
};

export function GoogleMaps({
	className,
	markerRadiusKm = 5,
	onMarkerRadiusKmChange,
	onCoverageAreaChange,
	onMovementChange,
	isMoving = true,
}: Props) {
	const { colorScheme } = useMapTheme();
	const [places, setPlaces] = useState<Place[]>([]);
	const [searchedPlace, setSearchedPlace] = useState<Place | null>(null);
	const effectiveMarkerRadiusKm = isMoving
		? markerRadiusKm
		: STATIONARY_MARKER_RADIUS_KM;

	useEffect(() => {
		onCoverageAreaChange?.(
			calculateCoveredAreaKm2(places, effectiveMarkerRadiusKm),
		);
	}, [effectiveMarkerRadiusKm, onCoverageAreaChange, places]);

	const addPlace = (place: Place) => {
		setPlaces((current) => {
			if (current.some((p) => p.id === place.id)) return current;

			return [...current, place];
		});
	};

	const handleMapClick = (event: MapMouseEvent) => {
		const latLng = event.detail.latLng;
		if (!latLng) return;

		addPlace({
			id: `click-${latLng.lat}-${latLng.lng}`,
			name: "Dropped pin",
			lat: latLng.lat,
			lng: latLng.lng,
		});
	};

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			libraries={["places"]}
		>
			<div
				className={twMerge("@container/map relative h-full w-full", className)}
			>
				<div className="absolute inset-s-5 inset-e-5 top-5 z-20">
					<SearchBox
						onSelect={setSearchedPlace}
						onMark={(place) => {
							setSearchedPlace(place);
							addPlace(place);
						}}
					/>
				</div>

				<div className="absolute flex flex-row gap-1 items-center bottom-5 inset-s-0 inset-e-0 z-10 mx-auto w-fit rounded-lg border border-border bg-card p-2 shadow-md @md/map:inset-s-auto @md/map:inset-e-5 @md/map:mx-0">
					{isMoving && (
						<div className="relative group">
							<p
								dir="ltr"
								className="w-11 text-end text-body-md font-medium tabular-nums"
							>
								{markerRadiusKm} km
							</p>

							<div className="pointer-events-none absolute bottom-full inset-s-0 inset-e-0 mx-auto flex w-8 flex-col items-center gap-1 rounded-lg border border-border bg-card p-2 opacity-0 shadow-md transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
								<Slider
									id="mapMarkerRadiusKm"
									orientation="vertical"
									min={1}
									max={20}
									step={1}
									value={[markerRadiusKm]}
									onValueChange={(value) => {
										onMarkerRadiusKmChange?.(value[0]);
									}}
								/>
							</div>
						</div>
					)}

					<Switch
						label1="Moving"
						label2="Fixed"
						value={!isMoving}
						setValue={(value) => onMovementChange?.(!value)}
					/>
				</div>

				<AppMap
					defaultCenter={{ lat: 30.0444, lng: 31.2357 }}
					defaultZoom={11}
					key={colorScheme}
					mapId={MAP_ID}
					colorScheme={colorScheme}
					className="h-full w-full"
					onDblclick={handleMapClick}
					disableDoubleClickZoom
					disableDefaultUI
					streetViewControl={false}
					mapTypeControl={false}
					fullscreenControl={false}
					zoomControl={false}
					rotateControl={false}
					scaleControl={false}
				>
					<SearchController place={searchedPlace} />
					{places.map((place) => (
						<MapMarker
							key={place.id}
							place={place}
							radiusKm={effectiveMarkerRadiusKm}
							showRadius={isMoving}
							onRemove={() =>
								setPlaces((current) => current.filter((p) => p.id !== place.id))
							}
						/>
					))}
				</AppMap>
			</div>
		</APIProvider>
	);
}
