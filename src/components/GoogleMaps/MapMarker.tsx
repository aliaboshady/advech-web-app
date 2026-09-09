import { AdvancedMarker, Circle } from "@vis.gl/react-google-maps";
import type { Place } from "./GoogleMaps";

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
					fillColor="#FF5001"
					fillOpacity={0.25}
					strokeColor="#FF5001"
					strokeOpacity={0.8}
					strokeWeight={2}
				/>
			)}
		</>
	);
}
