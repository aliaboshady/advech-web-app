import {
	AdvancedMarker,
	APIProvider,
	Map as AppMap,
	Circle,
	type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Place } from "@/components/GoogleMaps/GoogleMaps";
import { SearchBox } from "@/components/GoogleMaps/SearchBox";
import { SearchController } from "@/components/GoogleMaps/SearchController";
import { Slider } from "@/components/ui/slider";
import {
	kilometersToMeters,
	ZONE_MAX_RADIUS_KM,
	ZONE_MIN_RADIUS_KM,
} from "../point-zone-radius";

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
const RADIUS_KM_STEP = 0.05;
const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };

export type MapPoint = {
	lat: number;
	lng: number;
};

type Props = {
	point: MapPoint | null;
	radiusKm: number;
	onPointChange: (point: MapPoint) => void;
	onRadiusKmChange: (radiusKm: number) => void;
};

/**
 * Places one Point and previews its radius in kilometers.
 * The saved payload converts that radius to meters.
 */
export function PointZoneMap({
	point,
	radiusKm,
	onPointChange,
	onRadiusKmChange,
}: Props) {
	const { t } = useTranslation();
	const [searchedPlace, setSearchedPlace] = useState<Place | null>(null);
	const previewMeters = kilometersToMeters(radiusKm);
	const sliderKm = Math.min(
		ZONE_MAX_RADIUS_KM,
		Math.max(ZONE_MIN_RADIUS_KM, radiusKm),
	);
	const choosePlace = (place: Place): void => {
		setSearchedPlace(place);
		onPointChange({ lat: place.lat, lng: place.lng });
	};
	const handleMapClick = (event: MapMouseEvent): void => {
		const latLng = event.detail.latLng;
		if (!latLng) {
			return;
		}
		onPointChange({ lat: latLng.lat, lng: latLng.lng });
	};
	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			libraries={["places"]}
		>
			<div className="@container/map relative h-80 w-full overflow-hidden rounded-xl border">
				<div className="absolute inset-s-3 inset-e-3 top-3 z-20">
					<SearchBox
						onSelect={choosePlace}
						onMark={choosePlace}
						placeholder={t("campaigns.targeting.zoneSearch")}
					/>
				</div>
				<div className="absolute inset-s-3 bottom-3 z-10 w-48 rounded-lg bg-background/95 p-3 shadow-md backdrop-blur-sm">
					<p dir="ltr" className="mb-2 text-sm font-medium tabular-nums">
						{t("campaigns.targeting.radiusKmValue", { radius: sliderKm })}
					</p>
					<Slider
						min={ZONE_MIN_RADIUS_KM}
						max={ZONE_MAX_RADIUS_KM}
						step={RADIUS_KM_STEP}
						value={[sliderKm]}
						onValueChange={(value) => {
							onRadiusKmChange(value[0] ?? ZONE_MIN_RADIUS_KM);
						}}
					/>
				</div>
				<AppMap
					defaultCenter={point ?? CAIRO_CENTER}
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
					{point ? (
						<>
							<AdvancedMarker position={point} />
							<Circle
								center={point}
								radius={previewMeters}
								fillColor="#FF5001"
								fillOpacity={0.25}
								strokeColor="#FF5001"
								strokeOpacity={0.8}
								strokeWeight={2}
							/>
						</>
					) : null}
				</AppMap>
			</div>
		</APIProvider>
	);
}
