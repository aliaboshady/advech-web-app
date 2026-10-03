import { useEffect, useState } from "react";

type MapColorScheme = "LIGHT" | "DARK";

export type MapTheme = {
	colorScheme: MapColorScheme;
	/** Literal colour for map overlays; Google Maps cannot read CSS variables. */
	overlayColor: string;
};

function readTheme(): MapTheme {
	const root = document.documentElement;
	const token = getComputedStyle(root).getPropertyValue("--primary").trim();
	return {
		colorScheme: root.classList.contains("dark") ? "DARK" : "LIGHT",
		overlayColor: token,
	};
}

/**
 * The map's colour scheme and overlay colour, taken from the live theme tokens
 * and refreshed when the `dark` class on `<html>` changes.
 */
export function useMapTheme(): MapTheme {
	const [theme, setTheme] = useState<MapTheme>(readTheme);
	useEffect(() => {
		const observer = new MutationObserver(() => {
			const next = readTheme();
			setTheme((current) =>
				current.colorScheme === next.colorScheme &&
				current.overlayColor === next.overlayColor
					? current
					: next,
			);
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => observer.disconnect();
	}, []);
	return theme;
}
