import {
	AdvancedMarker,
	APIProvider,
	Map as AppMap,
	type MapMouseEvent,
} from "@vis.gl/react-google-maps";

import { useState } from "react";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { SearchBox } from "./SearchBox";
import { SearchController } from "./SearchController";

const MIN_MARK_DISTANCE_METERS = 10 * 500; // 10K meters
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

export type Place = {
	id: string;
	name: string;
	lat: number;
	lng: number;
};

const calculateDistanceInMeters = (from: Place, to: Place) => {
	const earthRadiusMeters = 6371000;
	const latDistance = ((to.lat - from.lat) * Math.PI) / 180;
	const lngDistance = ((to.lng - from.lng) * Math.PI) / 180;

	const latitudeA = (from.lat * Math.PI) / 180;
	const latitudeB = (to.lat * Math.PI) / 180;

	const a =
		Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
		Math.sin(lngDistance / 2) *
			Math.sin(lngDistance / 2) *
			Math.cos(latitudeA) *
			Math.cos(latitudeB);

	return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

type Props = {
	className?: string;
};

export function GoogleMaps({ className }: Props) {
	const [places, setPlaces] = useState<Place[]>([]);
	const [searchedPlace, setSearchedPlace] = useState<Place | null>(null);

	const addPlace = (place: Place) => {
		setPlaces((current) => {
			if (current.some((p) => p.id === place.id)) {
				return current;
			}

			const isTooCloseToExistingMark = current.some(
				(existingPlace) =>
					calculateDistanceInMeters(existingPlace, place) <
					MIN_MARK_DISTANCE_METERS,
			);

			if (isTooCloseToExistingMark) {
				toast.error(
					`This location is too close to an existing mark. Keep at least ${MIN_MARK_DISTANCE_METERS}m apart.`,
				);
				return current;
			}

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
			<div className={twMerge("relative h-full w-full", className)}>
				<div className="absolute inset-s-5 top-5 z-10">
					<SearchBox
						onSelect={setSearchedPlace}
						onMark={(place) => {
							setSearchedPlace(place);
							addPlace(place);
						}}
					/>
				</div>

				<AppMap
					defaultCenter={{
						lat: 30.0444,
						lng: 31.2357,
					}}
					defaultZoom={11}
					mapId={MAP_ID}
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
						<AdvancedMarker
							key={place.id}
							position={{
								lat: place.lat,
								lng: place.lng,
							}}
							title={place.name}
							onClick={() => {
								setPlaces((current) =>
									current.filter((p) => p.id !== place.id),
								);
							}}
						/>
					))}
				</AppMap>
			</div>
		</APIProvider>
	);
}
