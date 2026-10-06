import { type KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/inputs/Dropdown";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { createZone } from "@/features/zones/api/create-zone";
import { PointZoneMap } from "@/features/zones/components/PointZoneMap";
import { radiusMetersFromKilometers } from "@/features/zones/point-zone-radius";
import { CreatePointZonePayload, Zone } from "@/features/zones/types";
import useRequest from "@/hooks/useRequest";
import { BackendResponse } from "@/types";
import { idsWithoutContradiction, optionsForSide } from "../../zone-role";
import { FieldMessage } from "./FieldMessage";
import { FormField } from "./FormField";

const ZONE_NAME_MIN_LENGTH = 2;
const ZONE_NAME_MAX_LENGTH = 120;
const DEFAULT_RADIUS_KM = "5";

export type ZoneOption = {
	id: string;
	name: string;
};

type Props = {
	zones: ZoneOption[];
	inclusionZoneIds: string[];
	exclusionZoneIds: string[];
	readOnly: boolean;
	inclusionError: string;
	exclusionError: string;
	onInclusionChange: (zoneIds: string[]) => void;
	onExclusionChange: (zoneIds: string[]) => void;
	onZoneCreated: (zone: ZoneOption) => void;
};

function zoneNameError(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length < ZONE_NAME_MIN_LENGTH) {
		return "zoneNameMin";
	}
	if (trimmed.length > ZONE_NAME_MAX_LENGTH) {
		return "zoneNameMax";
	}
	return "";
}

/**
 * Inclusion and exclusion pickers, plus a map that saves a Point Zone. Renders
 * grid children for a FormSectionCard.
 */
export function ZoneFields({
	zones,
	inclusionZoneIds,
	exclusionZoneIds,
	readOnly,
	inclusionError,
	exclusionError,
	onInclusionChange,
	onExclusionChange,
	onZoneCreated,
}: Props) {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
	const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
	const [createError, setCreateError] = useState("");
	const { request: requestCreate, isLoading: isCreating } = useRequest<
		CreatePointZonePayload,
		BackendResponse<Zone>
	>(createZone);
	const parsedRadiusKm = Number(radiusKm);
	const radiusKmForMap = Number.isFinite(parsedRadiusKm)
		? parsedRadiusKm
		: Number(DEFAULT_RADIUS_KM);
	const saveZone = async (): Promise<void> => {
		const nameError = zoneNameError(name);
		if (nameError) {
			setCreateError(nameError);
			return;
		}
		if (!point) {
			setCreateError("zonePointRequired");
			return;
		}
		const radiusMeters = radiusMetersFromKilometers(parsedRadiusKm);
		if (radiusMeters === undefined) {
			setCreateError("zoneRadiusOutOfRange");
			return;
		}
		try {
			const response = await requestCreate({
				name: name.trim(),
				geometry: {
					type: "Point",
					coordinates: [point.lng, point.lat],
					radiusMeters,
				},
			});
			if (!response.data) {
				return;
			}
			onZoneCreated({ id: response.data.id, name: response.data.name });
			setName("");
			setPoint(null);
			setRadiusKm(DEFAULT_RADIUS_KM);
			setCreateError("");
		} catch {
			setCreateError("");
		}
	};
	const preventFormSubmit = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === "Enter") {
			event.preventDefault();
		}
	};
	return (
		<>
			<ZoneSideSelect
				label={t("campaigns.targeting.inclusionZones")}
				zones={optionsForSide(zones, inclusionZoneIds, exclusionZoneIds)}
				selected={inclusionZoneIds}
				readOnly={readOnly}
				error={inclusionError}
				onChange={(zoneIds) => {
					onInclusionChange(idsWithoutContradiction(zoneIds, exclusionZoneIds));
				}}
			/>
			<ZoneSideSelect
				label={t("campaigns.targeting.exclusionZones")}
				zones={optionsForSide(zones, exclusionZoneIds, inclusionZoneIds)}
				selected={exclusionZoneIds}
				readOnly={readOnly}
				error={exclusionError}
				onChange={(zoneIds) => {
					onExclusionChange(idsWithoutContradiction(zoneIds, inclusionZoneIds));
				}}
			/>
			{readOnly ? null : (
				<div className="flex flex-col gap-stack rounded-lg border border-border bg-background p-4 @md/formSection:col-span-2">
					<div className="flex flex-col gap-1">
						<h3 className="text-body-lg font-medium">
							{t("campaigns.targeting.newZone")}
						</h3>
						<p className="text-body-md text-muted-foreground">
							{t("campaigns.targeting.zonePointHint")}
						</p>
					</div>
					<div className="grid grid-cols-1 gap-stack @md/formSection:grid-cols-2">
						<TextInput
							name="zoneName"
							label={t("campaigns.targeting.zoneName")}
							placeholder={t("campaigns.targeting.zoneNamePlaceholder")}
							value={name}
							onChange={(event) => {
								setName(event.target.value);
							}}
							onKeyDown={preventFormSubmit}
						/>
						<TextInput
							name="radiusKm"
							type="number"
							label={t("campaigns.targeting.radiusKm")}
							value={radiusKm}
							onChange={(event) => {
								setRadiusKm(event.target.value);
							}}
							onKeyDown={preventFormSubmit}
						/>
					</div>
					<PointZoneMap
						point={point}
						radiusKm={radiusKmForMap}
						onPointChange={(nextPoint) => {
							setPoint(nextPoint);
							setCreateError("");
						}}
						onRadiusKmChange={(nextRadiusKm) => {
							setRadiusKm(String(Math.round(nextRadiusKm * 100) / 100));
						}}
					/>
					{createError ? <FieldMessage message={createError} /> : null}
					<div>
						<Button
							type="button"
							variant="secondary"
							className="w-full @sm/formSection:w-fit"
							disabled={isCreating}
							onClick={() => {
								void saveZone();
							}}
						>
							{t("campaigns.targeting.createZone")}
						</Button>
					</div>
				</div>
			)}
		</>
	);
}

type ZoneSideSelectProps = {
	label: string;
	zones: ZoneOption[];
	selected: string[];
	readOnly: boolean;
	error: string;
	onChange: (zoneIds: string[]) => void;
};

function ZoneSideSelect({
	label,
	zones,
	selected,
	readOnly,
	error,
	onChange,
}: ZoneSideSelectProps) {
	return (
		<FormField label={label} error={error}>
			<Dropdown
				multiSelect
				multiSelectExpandMode="showSome"
				showNoneOption
				noneOptionValue="campaigns.targeting.clear"
				items={zones.map((zone) => ({ value: zone.id, label: zone.name }))}
				selected={selected}
				setSelected={(zoneIds: string[]) => {
					onChange(zoneIds);
				}}
				disabled={readOnly}
				placeholder={label}
				error={error}
				hideErrorMessage
				className="w-full text-body-md!"
			/>
		</FormField>
	);
}
