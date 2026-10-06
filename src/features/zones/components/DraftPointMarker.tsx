import { AdvancedMarker, Circle } from "@vis.gl/react-google-maps";
import { MapPinIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { DraftPoint, draftPointLabel } from "../draft-point";
import { MAP_CONTROL_ATTRIBUTE, RadiusMetersInput } from "./RadiusMetersInput";

const HIGHLIGHTED_Z_INDEX = 1000;

type Props = {
	point: DraftPoint;
	isHighlighted: boolean;
	overlayColor: string;
	onRadiusChange: (radiusMeters: number) => void;
	onRemove: () => void;
};

/**
 * One dropped point and its radius circle. Hovering the pin shows its radius
 * input; clicking the pin removes it.
 */
export function DraftPointMarker({
	point,
	isHighlighted,
	overlayColor,
	onRadiusChange,
	onRemove,
}: Props) {
	const { t } = useTranslation();
	const [isHovered, setIsHovered] = useState(false);
	const label = draftPointLabel(point);
	const position = { lat: point.lat, lng: point.lng };
	return (
		<>
			<AdvancedMarker
				position={position}
				title={label}
				zIndex={isHighlighted || isHovered ? HIGHLIGHTED_Z_INDEX : undefined}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="relative flex flex-col items-center">
					<div
						className={twMerge(
							"absolute bottom-full mb-1 rounded-md border border-border bg-card p-2 text-card-foreground shadow-md transition-opacity duration-150",
							isHovered
								? "pointer-events-auto opacity-100"
								: "pointer-events-none opacity-0",
						)}
					>
						<RadiusMetersInput
							label={t("campaigns.targeting.radiusFor", { place: label })}
							radiusMeters={point.radiusMeters}
							onRadiusChange={onRadiusChange}
						/>
					</div>
					<button
						type="button"
						aria-label={t("campaigns.targeting.removePoint", { place: label })}
						className="cursor-pointer border-0 bg-transparent p-0"
						{...{ [MAP_CONTROL_ATTRIBUTE]: "" }}
						onClick={(event) => {
							event.stopPropagation();
							onRemove();
						}}
					>
						<MapPinIcon
							aria-hidden
							className={twMerge(
								"text-white drop-shadow-md transition-all duration-150",
								isHighlighted ? "size-11" : "size-8",
							)}
							style={{ fill: overlayColor }}
							strokeWidth={2.5}
						/>
					</button>
				</div>
			</AdvancedMarker>
			<Circle
				center={position}
				radius={point.radiusMeters}
				fillColor={overlayColor}
				fillOpacity={isHighlighted ? 0.4 : 0.2}
				strokeColor={overlayColor}
				strokeOpacity={isHighlighted ? 1 : 0.8}
				strokeWeight={isHighlighted ? 3 : 2}
			/>
		</>
	);
}
