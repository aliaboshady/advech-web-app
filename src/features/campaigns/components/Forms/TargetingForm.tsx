import { useRouter } from "@tanstack/react-router";
import { FormikProps, useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSectionCard } from "@/components/FormSectionCard";
import Dropdown from "@/components/Inputs/Dropdown";
import TextInput from "@/components/Inputs/TextInput";
import { Button } from "@/components/ui/button";
import { LookupItem, SchedulePresetOption } from "@/features/lookups/types";
import { Zone } from "@/features/zones/types";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { updateCampaignTargeting } from "../../api/update-campaign-targeting";
import {
	buildCampaignTargetingPayload,
	initialTimeZoneId,
	TargetingFormValues,
} from "../../build-campaign-targeting-payload";
import { isCampaignEditable } from "../../is-campaign-editable";
import { TARGETING_ERROR_FIELDS } from "../../targeting-error-fields";
import { targetingValidationSchema } from "../../targeting-validation";
import {
	Campaign,
	CampaignDayparting,
	CampaignZone,
	DeliveryMode,
	LookupRef,
	UpdateCampaignTargetingPayload,
	ZoneRole,
} from "../../types";
import { ChoiceButton } from "./ChoiceButton";
import { DaypartingFields } from "./DaypartingFields";
import { FieldMessage } from "./FieldMessage";
import { FormField } from "./FormField";
import { ZoneFields, ZoneOption } from "./ZoneFields";

const TARGETING_FIELD_NAMES: Record<string, string> = {
	"dayparting.days": "days",
	"dayparting.startTime": "startTime",
	"dayparting.endTime": "endTime",
};

type Props = {
	campaign: Campaign;
	timeZones: LookupItem[];
	schedulePresets: SchedulePresetOption[];
	interests: LookupItem[];
	venueTypes: LookupItem[];
	zones: Zone[];
};

function formatOptionalNumber(value: number | null): string {
	if (value === null) {
		return "";
	}
	return String(value);
}

function initialDaypartingKind(
	dayparting: CampaignDayparting | null,
): TargetingFormValues["daypartingKind"] {
	if (!dayparting) {
		return "";
	}
	if (dayparting.schedulePresetCode) {
		return "preset";
	}
	return "custom";
}

function zoneIdsByRole(zones: CampaignZone[], role: ZoneRole): string[] {
	return zones.filter((zone) => zone.role === role).map((zone) => zone.id);
}

function mergeZoneOptions(
	library: readonly ZoneOption[],
	saved: readonly ZoneOption[],
): ZoneOption[] {
	const byId = new Map<string, ZoneOption>();
	for (const zone of library) {
		byId.set(zone.id, { id: zone.id, name: zone.name });
	}
	for (const zone of saved) {
		if (!byId.has(zone.id)) {
			byId.set(zone.id, { id: zone.id, name: zone.name });
		}
	}
	return [...byId.values()].sort((left, right) =>
		left.name.localeCompare(right.name),
	);
}

function toTargetingFormValues(
	campaign: Campaign,
	timeZones: LookupItem[],
): TargetingFormValues {
	const dayparting = campaign.targeting.dayparting;
	return {
		timeZoneId: initialTimeZoneId(
			campaign.targeting.timeZone?.id,
			timeZones.map((zone) => zone.id),
			Intl.DateTimeFormat().resolvedOptions().timeZone,
		),
		daypartingEdited: false,
		daypartingKind: initialDaypartingKind(dayparting),
		schedulePresetCode: dayparting?.schedulePresetCode ?? "",
		days: dayparting?.days ?? [],
		startTime: dayparting?.startTime ?? "",
		endTime: dayparting?.endTime ?? "",
		daypartName: dayparting?.name ?? "",
		minAge: formatOptionalNumber(campaign.targeting.age.minAge),
		maxAge: formatOptionalNumber(campaign.targeting.age.maxAge),
		interestsEdited: false,
		interestCodes: campaign.targeting.interests.map((interest) => interest.id),
		venueTypesEdited: false,
		venueTypeCodes: campaign.targeting.venueTypes.map(
			(venueType) => venueType.id,
		),
		inclusionZonesEdited: false,
		inclusionZoneIds: zoneIdsByRole(campaign.targeting.zones, "INCLUSION"),
		exclusionZonesEdited: false,
		exclusionZoneIds: zoneIdsByRole(campaign.targeting.zones, "EXCLUSION"),
		carsCount: formatOptionalNumber(campaign.targeting.buy.carsCount),
		deliveryMode: campaign.targeting.buy.deliveryMode ?? "",
	};
}

function withSavedTimeZone(
	timeZones: LookupItem[],
	saved: LookupRef | null,
): LookupItem[] {
	if (!saved || timeZones.some((zone) => zone.id === saved.id)) {
		return timeZones;
	}
	return [{ id: saved.id, name: saved.name }, ...timeZones];
}

function visibleFieldError(
	formik: FormikProps<TargetingFormValues>,
	name: keyof TargetingFormValues,
): string {
	const message = formik.errors[name];
	if (typeof message !== "string" || !message) {
		return "";
	}
	if (!formik.touched[name] && formik.submitCount === 0) {
		return "";
	}
	return message;
}

export function TargetingForm({
	campaign,
	timeZones,
	schedulePresets,
	interests,
	venueTypes,
	zones,
}: Props) {
	const { t } = useTranslation();
	const router = useRouter();
	const isReadOnly = !isCampaignEditable(campaign.status);
	const [zoneLibrary, setZoneLibrary] = useState<ZoneOption[]>(() =>
		mergeZoneOptions(zones, campaign.targeting.zones),
	);
	const { request: requestUpdate, isLoading: isSaving } = useRequest<
		UpdateCampaignTargetingPayload,
		ServerResponse<Campaign>
	>(updateCampaignTargeting);
	const formik = useFormik<TargetingFormValues>({
		initialValues: toTargetingFormValues(campaign, timeZones),
		validationSchema: targetingValidationSchema,
		onSubmit: async (values) => {
			if (isReadOnly) {
				return;
			}
			try {
				await requestUpdate({
					id: campaign.id,
					...buildCampaignTargetingPayload(values),
				});
				await router.navigate({
					to: "/campaigns/$id/creative",
					params: { id: campaign.id },
				});
			} catch (error) {
				handleFormikError(
					error,
					formik,
					TARGETING_FIELD_NAMES,
					TARGETING_ERROR_FIELDS,
				);
			}
		},
	});
	const fieldError = (name: keyof TargetingFormValues): string =>
		visibleFieldError(formik, name);
	const zoneError = (formik.errors as Record<string, unknown>).zones;
	const zoneMessage = typeof zoneError === "string" ? zoneError : "";
	const timeZoneItems = withSavedTimeZone(
		timeZones,
		campaign.targeting.timeZone,
	);
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="flex w-full flex-col gap-section"
		>
			<FormSectionCard
				title={t("campaigns.targeting.sections.schedule")}
				description={t("campaigns.targeting.sections.scheduleDescription")}
			>
				<FormField
					label={t("campaigns.targeting.timeZone")}
					hint={t("campaigns.targeting.timeZoneHint")}
					error={fieldError("timeZoneId")}
				>
					<Dropdown
						items={timeZoneItems.map((zone) => ({
							value: zone.id,
							label: zone.name,
						}))}
						selected={formik.values.timeZoneId}
						setSelected={(value: string) => {
							formik.setFieldValue("timeZoneId", value);
							formik.setFieldTouched("timeZoneId", true, false);
						}}
						disabled={isReadOnly}
						placeholder={t("campaigns.targeting.timeZone")}
						error={fieldError("timeZoneId")}
						hideErrorMessage
						className="w-full text-body-md!"
					/>
				</FormField>
				<DaypartingFields
					formik={formik}
					schedulePresets={schedulePresets}
					readOnly={isReadOnly}
					fieldError={fieldError}
				/>
			</FormSectionCard>
			<FormSectionCard
				title={t("campaigns.targeting.sections.audience")}
				description={t("campaigns.targeting.sections.audienceDescription")}
			>
				<TextInput
					name="minAge"
					type="number"
					label={t("campaigns.targeting.minAge")}
					placeholder="13"
					value={formik.values.minAge}
					disabled={isReadOnly}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={fieldError("minAge")}
				/>
				<TextInput
					name="maxAge"
					type="number"
					label={t("campaigns.targeting.maxAge")}
					placeholder="99"
					value={formik.values.maxAge}
					disabled={isReadOnly}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={fieldError("maxAge")}
				/>
				<LookupMultiSelect
					label={t("campaigns.targeting.interests")}
					items={interests}
					selected={formik.values.interestCodes}
					readOnly={isReadOnly}
					error={fieldError("interestCodes")}
					onChange={(codes) => {
						formik.setFieldValue("interestCodes", codes);
						formik.setFieldValue("interestsEdited", true);
					}}
				/>
				<LookupMultiSelect
					label={t("campaigns.targeting.venueTypes")}
					items={venueTypes}
					selected={formik.values.venueTypeCodes}
					readOnly={isReadOnly}
					error={fieldError("venueTypeCodes")}
					onChange={(codes) => {
						formik.setFieldValue("venueTypeCodes", codes);
						formik.setFieldValue("venueTypesEdited", true);
					}}
				/>
			</FormSectionCard>
			<FormSectionCard
				title={t("campaigns.targeting.sections.delivery")}
				description={t("campaigns.targeting.sections.deliveryDescription")}
			>
				<TextInput
					name="carsCount"
					type="number"
					label={t("campaigns.targeting.carsCount")}
					placeholder="1"
					value={formik.values.carsCount}
					disabled={isReadOnly}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={fieldError("carsCount")}
				/>
				<DeliveryModeField
					value={formik.values.deliveryMode}
					readOnly={isReadOnly}
					onChange={(mode) => {
						formik.setFieldValue("deliveryMode", mode);
					}}
				/>
			</FormSectionCard>
			<FormSectionCard title={t("campaigns.targeting.zones")}>
				<div className="@md/formSection:col-span-2">
					<ZoneFields
						zones={zoneLibrary}
						inclusionZoneIds={formik.values.inclusionZoneIds}
						exclusionZoneIds={formik.values.exclusionZoneIds}
						readOnly={isReadOnly}
						inclusionError={fieldError("inclusionZoneIds")}
						exclusionError={fieldError("exclusionZoneIds")}
						onInclusionChange={(zoneIds) => {
							formik.setFieldValue("inclusionZoneIds", zoneIds);
							formik.setFieldValue("inclusionZonesEdited", true);
						}}
						onExclusionChange={(zoneIds) => {
							formik.setFieldValue("exclusionZoneIds", zoneIds);
							formik.setFieldValue("exclusionZonesEdited", true);
						}}
						onZoneCreated={(zone) => {
							setZoneLibrary((current) =>
								mergeZoneOptions([...current, zone], campaign.targeting.zones),
							);
						}}
					/>
				</div>
				{zoneMessage && formik.submitCount > 0 ? (
					<div className="@md/formSection:col-span-2">
						<FieldMessage message={zoneMessage} />
					</div>
				) : null}
			</FormSectionCard>
			{isReadOnly ? null : (
				<div className="flex flex-col-reverse justify-between gap-2 sm:flex-row">
					<Button
						type="button"
						variant="secondary"
						className="w-full sm:w-fit"
						onClick={() => {
							router.navigate({
								to: "/campaigns/$id/identity",
								params: { id: campaign.id },
							});
						}}
					>
						{t("campaigns.targeting.back")}
					</Button>
					<Button type="submit" className="w-full sm:w-fit" disabled={isSaving}>
						{t("campaigns.targeting.saveAndContinue")}
					</Button>
				</div>
			)}
		</form>
	);
}

type LookupMultiSelectProps = {
	label: string;
	items: LookupItem[];
	selected: string[];
	readOnly: boolean;
	error: string;
	onChange: (codes: string[]) => void;
};

function LookupMultiSelect({
	label,
	items,
	selected,
	readOnly,
	error,
	onChange,
}: LookupMultiSelectProps) {
	return (
		<FormField label={label} error={error}>
			<Dropdown
				multiSelect
				multiSelectExpandMode="showSome"
				showNoneOption
				noneOptionValue="campaigns.targeting.clear"
				items={items.map((item) => ({ value: item.id, label: item.name }))}
				selected={selected}
				setSelected={(codes: string[]) => {
					onChange(codes);
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

type DeliveryModeFieldProps = {
	value: "" | DeliveryMode;
	readOnly: boolean;
	onChange: (mode: DeliveryMode) => void;
};

function DeliveryModeField({
	value,
	readOnly,
	onChange,
}: DeliveryModeFieldProps) {
	const { t } = useTranslation();
	const modes = [
		{ mode: "MOVING" as const, label: t("campaigns.targeting.moving") },
		{ mode: "FIXED" as const, label: t("campaigns.targeting.fixed") },
	];
	return (
		<FormField label={t("campaigns.targeting.deliveryMode")}>
			<div className="flex flex-wrap gap-2">
				{modes.map((option) => (
					<ChoiceButton
						key={option.mode}
						selected={value === option.mode}
						disabled={readOnly}
						onClick={() => {
							onChange(option.mode);
						}}
					>
						{option.label}
					</ChoiceButton>
				))}
			</div>
		</FormField>
	);
}
