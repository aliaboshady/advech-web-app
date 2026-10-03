import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/Inputs/Dropdown";
import TextInput from "@/components/Inputs/TextInput";
import { SchedulePresetOption } from "@/features/lookups/types";
import {
	DaypartingKind,
	TargetingFormValues,
} from "../../build-campaign-targeting-payload";
import { ChoiceButton } from "./ChoiceButton";
import { FormField } from "./FormField";

const WEEKDAYS = [
	{ day: 1, labelKey: "campaigns.targeting.days.monday" },
	{ day: 2, labelKey: "campaigns.targeting.days.tuesday" },
	{ day: 3, labelKey: "campaigns.targeting.days.wednesday" },
	{ day: 4, labelKey: "campaigns.targeting.days.thursday" },
	{ day: 5, labelKey: "campaigns.targeting.days.friday" },
	{ day: 6, labelKey: "campaigns.targeting.days.saturday" },
	{ day: 7, labelKey: "campaigns.targeting.days.sunday" },
] as const;

type Props = {
	formik: FormikProps<TargetingFormValues>;
	schedulePresets: SchedulePresetOption[];
	readOnly: boolean;
	fieldError: (name: keyof TargetingFormValues) => string;
};

function chooseDaypartingKind(
	formik: FormikProps<TargetingFormValues>,
	kind: Exclude<DaypartingKind, "">,
): void {
	if (formik.values.daypartingKind === kind) {
		return;
	}
	formik.setValues({
		...formik.values,
		daypartingKind: kind,
		daypartingEdited: true,
		daypartName: kind === "preset" ? "" : formik.values.daypartName,
		schedulePresetCode:
			kind === "custom" ? "" : formik.values.schedulePresetCode,
	});
}

function markCustom(
	formik: FormikProps<TargetingFormValues>,
	patch: Partial<TargetingFormValues>,
): void {
	formik.setValues({
		...formik.values,
		...patch,
		daypartingKind: "custom",
		daypartingEdited: true,
		schedulePresetCode: "",
	});
}

/** Preset or custom Dayparting. The two are never sent together. */
export function DaypartingFields({
	formik,
	schedulePresets,
	readOnly,
	fieldError,
}: Props) {
	const { t } = useTranslation();
	const kind = formik.values.daypartingKind;
	const selectedPreset = schedulePresets.find(
		(preset) => preset.id === formik.values.schedulePresetCode,
	);
	const summary =
		kind === "preset" && formik.values.daypartingEdited && selectedPreset
			? selectedPreset
			: formik.values;
	const summaryLabels = summary.days
		.map((day) => {
			const weekday = WEEKDAYS.find((item) => item.day === day);
			return weekday ? t(weekday.labelKey) : "";
		})
		.filter((label) => label.length > 0)
		.join(", ");
	const windowHint =
		summaryLabels && summary.startTime && summary.endTime
			? `${t("campaigns.targeting.window")}: ${summaryLabels} ${summary.startTime}–${summary.endTime}`
			: undefined;
	return (
		<FormField
			wide
			label={t("campaigns.targeting.dayparting")}
			error={fieldError("daypartingKind")}
			className="gap-stack"
		>
			<div className="flex flex-wrap gap-2">
				<ChoiceButton
					selected={kind === "preset"}
					disabled={readOnly}
					onClick={() => chooseDaypartingKind(formik, "preset")}
				>
					{t("campaigns.targeting.schedulePreset")}
				</ChoiceButton>
				<ChoiceButton
					selected={kind === "custom"}
					disabled={readOnly}
					onClick={() => chooseDaypartingKind(formik, "custom")}
				>
					{t("campaigns.targeting.customWindow")}
				</ChoiceButton>
			</div>
			{kind === "preset" ? (
				<FormField
					label={t("campaigns.targeting.schedulePreset")}
					hint={windowHint}
					error={fieldError("schedulePresetCode")}
					className="md:max-w-md"
				>
					<Dropdown
						items={schedulePresets.map((preset) => ({
							value: preset.id,
							label: preset.name,
						}))}
						selected={formik.values.schedulePresetCode}
						setSelected={(code: string) => {
							formik.setValues({
								...formik.values,
								daypartingKind: "preset",
								daypartingEdited: true,
								schedulePresetCode: code,
								daypartName: "",
							});
						}}
						disabled={readOnly}
						placeholder={t("campaigns.targeting.schedulePreset")}
						error={fieldError("schedulePresetCode")}
						hideErrorMessage
						className="w-full text-body-md!"
					/>
				</FormField>
			) : null}
			{kind === "custom" ? (
				<div className="flex flex-col gap-stack">
					<FormField
						label={t("campaigns.targeting.daysLabel")}
						error={fieldError("days")}
					>
						<div className="flex flex-wrap gap-2">
							{WEEKDAYS.map((weekday) => {
								const isSelected = formik.values.days.includes(weekday.day);
								return (
									<ChoiceButton
										key={weekday.day}
										selected={isSelected}
										disabled={readOnly}
										onClick={() => {
											const selected = isSelected
												? formik.values.days.filter(
														(day) => day !== weekday.day,
													)
												: [...formik.values.days, weekday.day].sort(
														(left, right) => left - right,
													);
											markCustom(formik, { days: selected });
										}}
									>
										{t(weekday.labelKey)}
									</ChoiceButton>
								);
							})}
						</div>
					</FormField>
					<div className="grid gap-stack md:grid-cols-2">
						<TextInput
							name="startTime"
							type="time"
							label={t("campaigns.targeting.startTime")}
							value={formik.values.startTime}
							disabled={readOnly}
							onChange={(event) => {
								markCustom(formik, {
									startTime: event.target.value.slice(0, 5),
								});
							}}
							error={fieldError("startTime")}
						/>
						<TextInput
							name="endTime"
							type="time"
							label={t("campaigns.targeting.endTime")}
							value={formik.values.endTime}
							disabled={readOnly}
							onChange={(event) => {
								markCustom(formik, {
									endTime: event.target.value.slice(0, 5),
								});
							}}
							error={fieldError("endTime")}
						/>
					</div>
					<TextInput
						name="daypartName"
						label={t("campaigns.targeting.daypartName")}
						placeholder={t("campaigns.targeting.daypartNamePlaceholder")}
						value={formik.values.daypartName}
						disabled={readOnly}
						onChange={(event) => {
							markCustom(formik, { daypartName: event.target.value });
						}}
						error={fieldError("daypartName")}
						className="md:max-w-md"
					/>
				</div>
			) : null}
		</FormField>
	);
}
