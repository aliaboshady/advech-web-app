import { AdvancedMarker, Circle } from "@vis.gl/react-google-maps";
import type { Place } from "./GoogleMaps";
import { useMapTheme } from "./use-map-theme";

type Props = {
	onRemove: () => void;
	place: Place;
	radiusKm: number;
	showRadius?: boolean;
};

export function MapMarker({
	onRemove,
	place,
	radiusKm,
	showRadius = true,
}: Props) {
	const position = { lat: place.lat, lng: place.lng };
	const { overlayColor } = useMapTheme();

	return (
		<>
			<AdvancedMarker
				position={position}
				title={place.name}
				onClick={onRemove}
			/>
			{showRadius && (
				<Circle
					center={position}
					radius={radiusKm * 1000}
					fillColor={overlayColor}
					fillOpacity={0.25}
					strokeColor={overlayColor}
					strokeOpacity={0.8}
					strokeWeight={2}
				/>
			)}
		</>
	);
}
