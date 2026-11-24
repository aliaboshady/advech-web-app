import { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { isZoneRadiusMeters } from "../draft-point";
import {
	ZONE_MAX_RADIUS_METERS,
	ZONE_MIN_RADIUS_METERS,
} from "../point-zone-radius";

const RADIUS_STEP_METERS = 100;

/** Marks controls the map's click handler must ignore. */
export const MAP_CONTROL_ATTRIBUTE = "data-map-control";

type Props = {
	label: string;
	radiusMeters: number;
	onRadiusChange: (radiusMeters: number) => void;
};

const stopPropagation = (event: SyntheticEvent): void => {
	event.stopPropagation();
};

/**
 * A point's radius in meters. Typing stays local; only a radius a Zone accepts
 * is reported, and an invalid one snaps back on blur. Events stop here so the
 * map and the menu around it do not react to them.
 */
export function RadiusMetersInput({
	label,
	radiusMeters,
	onRadiusChange,
}: Props) {
	const { t } = useTranslation();
	const [value, setValue] = useState(String(radiusMeters));
	useEffect(() => {
		setValue(String(radiusMeters));
	}, [radiusMeters]);
	return (
		<div
			className="flex items-center gap-1"
			{...{ [MAP_CONTROL_ATTRIBUTE]: "" }}
		>
			<Input
				aria-label={label}
				type="number"
				inputMode="numeric"
				min={ZONE_MIN_RADIUS_METERS}
				max={ZONE_MAX_RADIUS_METERS}
				step={RADIUS_STEP_METERS}
				value={value}
				className="h-8 w-22 px-2 text-center text-body-md tabular-nums"
				onPointerDown={stopPropagation}
				onMouseDown={stopPropagation}
				onClick={stopPropagation}
				onKeyDown={(event) => {
					event.stopPropagation();
					if (event.key === "Enter") {
						event.preventDefault();
					}
				}}
				onChange={(event) => {
					setValue(event.target.value);
					const next = Number(event.target.value);
					if (isZoneRadiusMeters(next)) {
						onRadiusChange(next);
					}
				}}
				onBlur={() => {
					if (!isZoneRadiusMeters(Number(value))) {
						setValue(String(radiusMeters));
					}
				}}
			/>
			<span className="text-body-md text-muted-foreground">
				{t("campaigns.targeting.meters")}
			</span>
		</div>
	);
}
