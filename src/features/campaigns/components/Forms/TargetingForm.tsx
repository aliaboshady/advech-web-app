import { useRouter } from "@tanstack/react-router";
import { FormikProps, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/Inputs/Dropdown";
import TextInput from "@/components/Inputs/TextInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LookupItem, SchedulePresetOption } from "@/features/lookups/types";
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
	DeliveryMode,
	LookupRef,
	UpdateCampaignTargetingPayload,
} from "../../types";
import { DaypartingFields } from "./DaypartingFields";

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

function FieldMessage({ message }: { message: string }) {
	const { t } = useTranslation();
	if (!message) {
		return null;
	}
	return (
		<p className="text-xs text-destructive font-medium">
			{t(`errors.${message}`, { defaultValue: message })}
		</p>
	);
}

export function TargetingForm({
	campaign,
	timeZones,
	schedulePresets,
	interests,
	venueTypes,
}: Props) {
	const { t } = useTranslation();
	const router = useRouter();
	const isReadOnly = !isCampaignEditable(campaign.status);
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
			className="@container bg-primary-foreground w-full @sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl"
		>
			<div className="flex flex-col gap-2 @xl:w-96">
				<Label>{t("campaigns.targeting.timeZone")}</Label>
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
					error={
						fieldError("timeZoneId")
							? `errors.${fieldError("timeZoneId")}`
							: undefined
					}
				/>
			</div>
			<DaypartingFields
				formik={formik}
				schedulePresets={schedulePresets}
				readOnly={isReadOnly}
				fieldError={fieldError}
			/>
			<div className="grid gap-4 @xl:grid-cols-2 @xl:w-[40rem]">
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
			</div>
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
				className="@xl:w-96"
			/>
			<DeliveryModeField
				value={formik.values.deliveryMode}
				readOnly={isReadOnly}
				onChange={(mode) => {
					formik.setFieldValue("deliveryMode", mode);
				}}
			/>
			{zoneMessage && formik.submitCount > 0 ? (
				<FieldMessage message={zoneMessage} />
			) : null}
			{isReadOnly ? null : (
				<div className="w-full flex flex-col-reverse @sm:flex-row gap-2 justify-between items-end">
					<Button
						type="button"
						variant="secondary"
						className="w-full @sm:w-fit"
						onClick={() => {
							router.navigate({
								to: "/campaigns/$id/identity",
								params: { id: campaign.id },
							});
						}}
					>
						{t("campaigns.targeting.back")}
					</Button>
					<Button
						type="submit"
						className="w-full @sm:w-fit"
						disabled={isSaving}
					>
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
		<div className="flex flex-col gap-2 @xl:w-96">
			<Label>{label}</Label>
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
				error={error ? `errors.${error}` : undefined}
			/>
		</div>
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
		<div className="flex flex-col gap-2">
			<Label>{t("campaigns.targeting.deliveryMode")}</Label>
			<div className="flex flex-wrap gap-2">
				{modes.map((option) => (
					<Button
						key={option.mode}
						type="button"
						variant={value === option.mode ? "default" : "outline"}
						disabled={readOnly}
						onClick={() => {
							onChange(option.mode);
						}}
					>
						{option.label}
					</Button>
				))}
			</div>
		</div>
	);
}
