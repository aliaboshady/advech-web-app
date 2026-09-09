import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Info, MapPinPlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Place } from "./GoogleMaps";

export function SearchBox({
	onSelect,
	onMark,
}: {
	onSelect: (place: Place) => void;
	onMark: (place: Place) => void;
}) {
	const { t } = useTranslation();
	const places = useMapsLibrary("places");

	const [input, setInput] = useState("");
	const [predictions, setPredictions] = useState<
		google.maps.places.PlacePrediction[]
	>([]);

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
		<div className="relative w-full @md/map:w-87.5">
			<div className="flex flex-row w-full items-center gap-2">
				<input
					value={input}
					onChange={(e) => handleChange(e.target.value)}
					placeholder="Search for a place..."
					className="w-full rounded-xl border border-input bg-background px-3 py-3 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
				/>

				<Tooltip>
					<TooltipTrigger asChild>
						<Info className="bg-background rounded-full w-7 h-7 p-1" />
					</TooltipTrigger>

					<TooltipContent
						sideOffset={5}
						side="bottom"
						className="text-white bg-black [&_svg]:bg-black! [&_svg]:fill-black!"
					>
						<p>{t("locale:Double click to mark area")}</p>
					</TooltipContent>
				</Tooltip>
			</div>

			{predictions.length > 0 && (
				<div className="mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
					{predictions.map((prediction) => (
						<div
							key={prediction.placeId}
							className="flex items-center border-b border-border last:border-b-0"
						>
							<button
								type="button"
								onClick={() => handleSelect(prediction)}
								className="min-w-0 flex-1 px-3 py-2.5 text-end text-sm transition hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
							>
								<div className="truncate font-medium">
									{prediction.mainText?.text}
								</div>

								<div className="truncate text-xs text-muted-foreground">
									{prediction.secondaryText?.text}
								</div>
							</button>

							<MapPinPlusIcon
								onClick={() => handleMark(prediction)}
								className="me-2 shrink-0 rounded-md w-7 h-7 p-1 font-medium transition hover:bg-accent text-primary focus:outline-none"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
