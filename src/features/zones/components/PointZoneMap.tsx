import {
	APIProvider,
	Map as AppMap,
	type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Place } from "@/components/GoogleMaps/GoogleMaps";
import { SearchBox } from "@/components/GoogleMaps/SearchBox";
import { SearchController } from "@/components/GoogleMaps/SearchController";
import { useMapTheme } from "@/components/GoogleMaps/use-map-theme";
import {
	addDraftPoint,
	DEFAULT_RADIUS_METERS,
	DraftPoint,
	removeDraftPoint,
	setDraftPointRadius,
	updateDraftPoint,
} from "../draft-point";
import { DraftPointMarker } from "./DraftPointMarker";
import { DraftPointsMenu } from "./DraftPointsMenu";
import { MAP_CONTROL_ATTRIBUTE } from "./RadiusMetersInput";

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };

type Props = {
	points: DraftPoint[];
	setPoints: Dispatch<SetStateAction<DraftPoint[]>>;
};

/**
 * Drops points to save as Point Zones: click the map or a place on it, or mark
 * a search result. Each point has its own radius, editable on the pin or in
 * the points list.
 */
export function PointZoneMap({ points, setPoints }: Props) {
	const { t } = useTranslation();
	const { colorScheme, overlayColor } = useMapTheme();
	const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
	const [highlightedId, setHighlightedId] = useState<string | null>(null);

	const addPoint = (point: DraftPoint): void => {
		setPoints((current) => addDraftPoint(current, point));
	};

	// Names arrive after the pin is shown; the pin stays if the lookup fails.
	const nameFromGooglePlace = async (id: string): Promise<void> => {
		try {
			const place = new google.maps.places.Place({ id });
			await place.fetchFields({ fields: ["displayName", "formattedAddress"] });
			setPoints((current) =>
				updateDraftPoint(current, id, {
					name: place.displayName ?? "",
					address: place.formattedAddress ?? undefined,
				}),
			);
		} catch {
			// Keep the coordinates as the label.
		}
	};
	const nameFromAddress = async (
		id: string,
		location: google.maps.LatLngLiteral,
	): Promise<void> => {
		try {
			const { results } = await new google.maps.Geocoder().geocode({
				location,
			});
			const address = results[0]?.formatted_address;
			if (address) {
				setPoints((current) => updateDraftPoint(current, id, { address }));
			}
		} catch {
			// Keep the coordinates as the label.
		}
	};

	const handleMapClick = (event: MapMouseEvent): void => {
		const target = event.domEvent?.target;
		if (
			target instanceof Element &&
			target.closest(`[${MAP_CONTROL_ATTRIBUTE}]`)
		) {
			return;
		}
		const { placeId, latLng } = event.detail;
		if (!latLng) {
			return;
		}
		if (placeId) {
			// Stop Google's own info window for the clicked place.
			event.stop();
			addPoint({
				id: placeId,
				name: "",
				lat: latLng.lat,
				lng: latLng.lng,
				radiusMeters: DEFAULT_RADIUS_METERS,
			});
			void nameFromGooglePlace(placeId);
			return;
		}
		const id = `click-${latLng.lat}-${latLng.lng}`;
		addPoint({
			id,
			name: "",
			lat: latLng.lat,
			lng: latLng.lng,
			radiusMeters: DEFAULT_RADIUS_METERS,
		});
		void nameFromAddress(id, latLng);
	};

	const focusPoint = (point: DraftPoint): void => {
		setFocusedPlace({
			id: point.id,
			name: point.name,
			lat: point.lat,
			lng: point.lng,
		});
	};
	const changeRadius = (id: string, radiusMeters: number): void => {
		setPoints((current) => setDraftPointRadius(current, id, radiusMeters));
	};
	const removePoint = (id: string): void => {
		setPoints((current) => removeDraftPoint(current, id));
	};

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			libraries={["places"]}
		>
			<div className="@container/map relative h-100 w-full overflow-hidden rounded-lg border border-border">
				<div className="absolute inset-s-3 inset-e-3 top-3 z-20 @md/map:w-fit">
					<SearchBox
						onSelect={setFocusedPlace}
						onMark={(place) => {
							setFocusedPlace(place);
							addPoint({
								id: place.id,
								name: place.name,
								address: place.address,
								lat: place.lat,
								lng: place.lng,
								radiusMeters: DEFAULT_RADIUS_METERS,
							});
						}}
						placeholder={t("campaigns.targeting.zoneSearch")}
						trailing={
							<DraftPointsMenu
								points={points}
								onSelect={focusPoint}
								onRadiusChange={changeRadius}
								onRemove={removePoint}
								onHover={setHighlightedId}
							/>
						}
					/>
				</div>
				<AppMap
					key={colorScheme}
					defaultCenter={CAIRO_CENTER}
					defaultZoom={11}
					mapId={MAP_ID}
					colorScheme={colorScheme}
					className="h-full w-full"
					onClick={handleMapClick}
					disableDoubleClickZoom
					disableDefaultUI
					streetViewControl={false}
					mapTypeControl={false}
					fullscreenControl={false}
					zoomControl={false}
					rotateControl={false}
					scaleControl={false}
				>
					<SearchController place={focusedPlace} />
					{points.map((point) => (
						<DraftPointMarker
							key={point.id}
							point={point}
							isHighlighted={highlightedId === point.id}
							overlayColor={overlayColor}
							onRadiusChange={(radiusMeters) =>
								changeRadius(point.id, radiusMeters)
							}
							onRemove={() => removePoint(point.id)}
						/>
					))}
				</AppMap>
			</div>
		</APIProvider>
	);
}
