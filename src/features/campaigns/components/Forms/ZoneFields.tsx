import { useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/inputs/Dropdown";
import { Button } from "@/components/ui/button";
import { createZone } from "@/features/zones/api/create-zone";
import { PointZoneMap } from "@/features/zones/components/PointZoneMap";
import {
	DraftPoint,
	removeDraftPoint,
	toCreatePointZonePayload,
} from "@/features/zones/draft-point";
import { CreatePointZonePayload, Zone } from "@/features/zones/types";
import useRequest from "@/hooks/useRequest";
import { BackendResponse } from "@/types";
import { idsWithoutContradiction, optionsForSide } from "../../zone-role";
import { FormField } from "./FormField";

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

/**
 * Inclusion and exclusion pickers, plus a map whose dropped points are saved
 * as Point Zones. Renders grid children for a FormSectionCard.
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
	const [points, setPoints] = useState<DraftPoint[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const { request: requestCreate } = useRequest<
		CreatePointZonePayload,
		BackendResponse<Zone>
	>(createZone);
	// One Zone per point, in order. A point leaves the list once its Zone is
	// saved; the first failure stops, keeping it and the rest to retry.
	const saveZones = async (): Promise<void> => {
		setIsSaving(true);
		try {
			for (const point of points) {
				const response = await requestCreate(toCreatePointZonePayload(point));
				if (!response.data) {
					return;
				}
				onZoneCreated({ id: response.data.id, name: response.data.name });
				setPoints((current) => removeDraftPoint(current, point.id));
			}
		} catch {
			// useRequest has already shown the error.
		} finally {
			setIsSaving(false);
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
							{t("campaigns.targeting.newZones")}
						</h3>
						<p className="text-body-md text-muted-foreground">
							{t("campaigns.targeting.zonePointHint")}
						</p>
					</div>
					<PointZoneMap points={points} setPoints={setPoints} />
					<div>
						<Button
							type="button"
							variant="secondary"
							className="w-full @sm/formSection:w-fit"
							disabled={isSaving || points.length === 0}
							onClick={() => {
								void saveZones();
							}}
						>
							{t("campaigns.targeting.saveZones", { count: points.length })}
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
