import { FormikProps } from "formik";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { SchedulePresetFormValues } from "../build-schedule-preset-request";
import {
	isTimeOfDay,
	SCHEDULE_WEEKDAYS,
	windowCrossesMidnight,
} from "../schedule-window";

type ScheduleWindowFieldsProps = {
	readonly formik: FormikProps<SchedulePresetFormValues>;
};

async function toggleDay(
	formik: FormikProps<SchedulePresetFormValues>,
	day: number,
): Promise<void> {
	const isSelected = formik.values.days.includes(day);
	const days = isSelected
		? formik.values.days.filter((item) => item !== day)
		: [...formik.values.days, day].sort((left, right) => left - right);
	await formik.setFieldValue("days", days);
	await formik.setFieldTouched("days", true, false);
}

function timeError(
	formik: FormikProps<SchedulePresetFormValues>,
	name: "startTime" | "endTime",
): string {
	const error = formik.errors[name];
	if (!formik.touched[name] || typeof error !== "string") {
		return "";
	}
	return error;
}

/** Weekday selector and start and end times for a Schedule Preset. */
export function ScheduleWindowFields({ formik }: ScheduleWindowFieldsProps) {
	const { t } = useTranslation();
	const { startTime, endTime } = formik.values;
	const crossesMidnight =
		isTimeOfDay(startTime) &&
		isTimeOfDay(endTime) &&
		windowCrossesMidnight({ startTime, endTime });
	const daysError =
		formik.touched.days && typeof formik.errors.days === "string"
			? formik.errors.days
			: "";
	return (
		<div className="flex flex-col gap-stack">
			<p className="text-body-md font-medium">{t("admin.lookups.daysLabel")}</p>
			<div className="flex flex-wrap gap-2">
				{SCHEDULE_WEEKDAYS.map((weekday) => {
					const isSelected = formik.values.days.includes(weekday.day);
					return (
						<Button
							key={weekday.day}
							type="button"
							variant="outline"
							aria-pressed={isSelected}
							className="aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90 aria-pressed:hover:text-background"
							onClick={() => toggleDay(formik, weekday.day)}
						>
							{isSelected ? <CheckIcon aria-hidden="true" /> : null}
							{t(weekday.labelKey)}
						</Button>
					);
				})}
			</div>
			{daysError ? (
				<p className="text-body-md font-medium text-destructive">
					{t(`errors.${daysError}`, { defaultValue: daysError })}
				</p>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2">
				<TextInput
					name="startTime"
					type="time"
					label={t("admin.lookups.startTime")}
					value={startTime}
					onChange={(event) => {
						void formik.setFieldValue(
							"startTime",
							event.target.value.slice(0, 5),
						);
					}}
					onBlur={() => {
						void formik.setFieldTouched("startTime", true);
					}}
					error={timeError(formik, "startTime")}
				/>
				<TextInput
					name="endTime"
					type="time"
					label={t("admin.lookups.endTime")}
					value={endTime}
					onChange={(event) => {
						void formik.setFieldValue(
							"endTime",
							event.target.value.slice(0, 5),
						);
					}}
					onBlur={() => {
						void formik.setFieldTouched("endTime", true);
					}}
					error={timeError(formik, "endTime")}
				/>
			</div>
			{crossesMidnight ? (
				<p className="text-body-md text-muted-foreground">
					{t("admin.lookups.crossesMidnight")}
				</p>
			) : null}
		</div>
	);
}
