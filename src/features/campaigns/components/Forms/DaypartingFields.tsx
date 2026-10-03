import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/Inputs/Dropdown";
import TextInput from "@/components/Inputs/TextInput";
import { Button } from "@/components/ui/button";
import { SchedulePresetOption } from "@/features/lookups/types";
import {
	DaypartingKind,
	TargetingFormValues,
} from "../../build-campaign-targeting-payload";
import { FieldMessage } from "./FieldMessage";

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
	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm font-medium">
				{t("campaigns.targeting.dayparting")}
			</p>
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant={kind === "preset" ? "default" : "outline"}
					disabled={readOnly}
					onClick={() => chooseDaypartingKind(formik, "preset")}
				>
					{t("campaigns.targeting.schedulePreset")}
				</Button>
				<Button
					type="button"
					variant={kind === "custom" ? "default" : "outline"}
					disabled={readOnly}
					onClick={() => chooseDaypartingKind(formik, "custom")}
				>
					{t("campaigns.targeting.customWindow")}
				</Button>
			</div>
			<FieldMessage message={fieldError("daypartingKind")} />
			{kind === "preset" ? (
				<div className="flex flex-col gap-2 @xl:w-96">
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
						error={
							fieldError("schedulePresetCode")
								? `errors.${fieldError("schedulePresetCode")}`
								: undefined
						}
					/>
					{summaryLabels && summary.startTime && summary.endTime ? (
						<p className="text-sm text-muted-foreground">
							{t("campaigns.targeting.window")}: {summaryLabels}{" "}
							{summary.startTime}–{summary.endTime}
						</p>
					) : null}
				</div>
			) : null}
			{kind === "custom" ? (
				<div className="flex flex-col gap-3">
					<div className="flex flex-wrap gap-2">
						{WEEKDAYS.map((weekday) => {
							const isSelected = formik.values.days.includes(weekday.day);
							return (
								<Button
									key={weekday.day}
									type="button"
									variant={isSelected ? "default" : "outline"}
									aria-pressed={isSelected}
									disabled={readOnly}
									onClick={() => {
										const selected = isSelected
											? formik.values.days.filter((day) => day !== weekday.day)
											: [...formik.values.days, weekday.day].sort(
													(left, right) => left - right,
												);
										markCustom(formik, { days: selected });
									}}
								>
									{t(weekday.labelKey)}
								</Button>
							);
						})}
					</div>
					<FieldMessage message={fieldError("days")} />
					<div className="grid gap-4 @xl:grid-cols-2 @xl:w-[40rem]">
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
						className="@xl:w-96"
					/>
				</div>
			) : null}
		</div>
	);
}
