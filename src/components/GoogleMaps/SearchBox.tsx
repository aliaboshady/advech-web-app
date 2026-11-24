import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Info, MapPinPlusIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Place } from "./GoogleMaps";

export function SearchBox({
	onSelect,
	onMark,
	placeholder,
	trailing,
}: {
	onSelect: (place: Place) => void;
	onMark: (place: Place) => void;
	placeholder?: string;
	/** Rendered after the input, e.g. the list of dropped points. */
	trailing?: ReactNode;
}) {
	const { t } = useTranslation();
	const places = useMapsLibrary("places");
	const searchBoxRef = useRef<HTMLDivElement>(null);

	const [input, setInput] = useState("");
	const [predictions, setPredictions] = useState<
		google.maps.places.PlacePrediction[]
	>([]);

	// Suggestions close when the user clicks anywhere outside the search box.
	useEffect(() => {
		const closeOnOutsidePointer = (event: PointerEvent) => {
			if (
				event.target instanceof Node &&
				!searchBoxRef.current?.contains(event.target)
			) {
				setPredictions([]);
			}
		};
		document.addEventListener("pointerdown", closeOnOutsidePointer);
		return () =>
			document.removeEventListener("pointerdown", closeOnOutsidePointer);
	}, []);

	const handleChange = async (value: string) => {
		setInput(value);

		if (!places || !value.trim()) {
			setPredictions([]);
			return;
		}

		const { suggestions } =
			await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
				{
					input: value,
				},
			);

		setPredictions(
			suggestions
				.map((suggestion) => suggestion.placePrediction)
				.filter(
					(prediction): prediction is google.maps.places.PlacePrediction =>
						prediction !== null,
				),
		);
	};

	const getPlace = async (
		prediction: google.maps.places.PlacePrediction,
	): Promise<Place | null> => {
		const place = prediction.toPlace();

		await place.fetchFields({
			fields: ["displayName", "formattedAddress", "location"],
		});

		if (!place.location) return null;

		return {
			id: place.id ?? crypto.randomUUID(),
			name: place.displayName ?? prediction.text.toString(),
			address: place.formattedAddress ?? undefined,
			lat: place.location.lat(),
			lng: place.location.lng(),
		};
	};

	const handleSelect = async (
		prediction: google.maps.places.PlacePrediction,
	) => {
		const place = await getPlace(prediction);

		if (!place) return;

		setInput(place.name);
		setPredictions([]);

		onSelect(place);
	};

	const handleMark = async (prediction: google.maps.places.PlacePrediction) => {
		const place = await getPlace(prediction);

		if (!place) return;

		setInput(place.name);
		setPredictions([]);

		onMark(place);
	};

	return (
		<div ref={searchBoxRef} className="relative w-full @md/map:w-87.5">
			<div className="flex flex-row w-full items-center gap-2">
				<input
					value={input}
					onChange={(e) => handleChange(e.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
						}
					}}
					placeholder={placeholder ?? t("common.searchPlace")}
					className="min-w-0 flex-1 rounded-md border border-input bg-card px-3 py-2.5 text-body-md text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
				/>

				<Tooltip>
					<TooltipTrigger asChild>
						<Info
							aria-label={t("common.mapPlaceHint")}
							className="size-7 shrink-0 rounded-full border border-border bg-card p-1 text-muted-foreground"
						/>
					</TooltipTrigger>

					<TooltipContent sideOffset={5} side="bottom">
						<p>{t("common.mapPlaceHint")}</p>
					</TooltipContent>
				</Tooltip>

				{trailing}
			</div>

			{predictions.length > 0 && (
				<div className="mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
					{predictions.map((prediction) => (
						<div
							key={prediction.placeId}
							className="flex items-center border-b border-border last:border-b-0"
						>
							<button
								type="button"
								onClick={() => handleSelect(prediction)}
								className="min-w-0 flex-1 px-3 py-2.5 text-start text-body-md transition hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
							>
								<div className="truncate font-medium">
									{prediction.mainText?.text}
								</div>

								<div className="truncate text-body-md text-muted-foreground">
									{prediction.secondaryText?.text}
								</div>
							</button>

							<button
								type="button"
								aria-label={t("common.mapPlaceHint")}
								onClick={() => handleMark(prediction)}
								className="me-2 shrink-0 rounded-md p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
							>
								<MapPinPlusIcon aria-hidden className="size-5" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
