import { useMap } from "@vis.gl/react-google-maps";

import { useEffect } from "react";
import { Place } from "./GoogleMaps";

export function SearchController({ place }: { place: Place | null }) {
	const map = useMap();

	useEffect(() => {
		if (!map || !place) return;

		map.panTo({
			lat: place.lat,
			lng: place.lng,
		});

		map.setZoom(16);
	}, [map, place]);

	return null;
}
