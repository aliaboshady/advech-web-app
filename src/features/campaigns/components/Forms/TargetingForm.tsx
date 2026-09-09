import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { IdCardIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { GoogleMaps } from "@/components/GoogleMaps/GoogleMaps";
import { DatePicker } from "@/components/Inputs/DatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { handleFormikError } from "@/lib/utils";

export function TargetingForm() {
	const { t } = useTranslation();
	const router = useRouter();
	const [date, setDate] = useState<DateRange | undefined>();
	const [carCount, setCarCount] = useState([1]);
	const [coverageAreaKm2, setCoverageAreaKm2] = useState(0);

	const formik = useFormik({
		initialValues: {
			campaignName: "",
			primaryObjective: "",
			startDate: undefined as Date | undefined,
			endDate: undefined as Date | undefined,
			startHour: "",
			endHour: "",
			carCount: 1,
		},
		// validationSchema: validationSchema.login,
		onSubmit: async (_values) => {
			try {
				// await request({
				//   email: values.email,
				//   password: values.password,
				// });
				true;
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	const startDate = formik.values.startDate;
	const endDate = formik.values.endDate;
	const campaignDays =
		startDate && endDate
			? Math.floor(
					(endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
				) + 1
			: 0;
	const startHour = formik.values.startHour
		? Number(formik.values.startHour.split(":")[0]) +
			Number(formik.values.startHour.split(":")[1]) / 60
		: 0;
	const endHour = formik.values.endHour
		? Number(formik.values.endHour.split(":")[0]) +
			Number(formik.values.endHour.split(":")[1]) / 60
		: 0;
	const hoursPerDay = endHour > startHour ? endHour - startHour : 0;
	const totalHours = campaignDays * hoursPerDay;
	const totalBudget = totalHours * formik.values.carCount * 12;
	const totalImpressions = Math.round(
		totalHours * formik.values.carCount * coverageAreaKm2 * 1000,
	);

	return (
		<div className="@container bg-primary-foreground w-full sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl">
			<div className="w-full flex flex-row flex-1 gap-4">
				<GoogleMaps
					className="rounded-lg overflow-hidden"
					onCoverageAreaChange={setCoverageAreaKm2}
				/>
				{/* <div className="w-full h-full rounded-lg bg-gray-300" /> */}

				<Card className="rounded-lg transition-colors p-6 w-1/3">
					<CardContent className="p-0">
						<FormikTextInput
							formik={formik}
							label={t("locale:Campaign Name")}
							placeholder={t("locale:Campaign Name")}
							name="campaignName"
							icon={<IdCardIcon size={15} />}
						/>

						<div className="flex flex-col gap-2">
							<Label>{t("campaigns.targeting.dates")}</Label>
							<DatePicker
								mode="range"
								localTime
								date={date as DateRange}
								setDate={(value: DateRange) => {
									setDate(value);
									if (!value) {
										formik.setValues({
											...formik.values,
											startDate: undefined,
											endDate: undefined,
										});
										return;
									}

									formik.setValues({
										...formik.values,
										startDate: value.from,
										endDate: value.to,
									});
								}}
								placeholder="campaigns.targeting.selectDates"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-2">
								<Label htmlFor="startHour">
									{t("campaigns.targeting.startHour")}
								</Label>
								<Input
									id="startHour"
									name="startHour"
									type="time"
									value={formik.values.startHour}
									onChange={formik.handleChange}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="endHour">
									{t("campaigns.targeting.endHour")}
								</Label>
								<Input
									id="endHour"
									name="endHour"
									type="time"
									value={formik.values.endHour}
									onChange={formik.handleChange}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<Label htmlFor="carCount">
									{t("campaigns.targeting.cars")}
								</Label>
								<span className="text-sm font-medium tabular-nums">
									{carCount[0]}
								</span>
							</div>

							<Slider
								id="carCount"
								min={1}
								max={30}
								step={1}
								value={carCount}
								onValueChange={(value: number[]) => {
									setCarCount(value);
									formik.setFieldValue("carCount", value[0]);
								}}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3 border-t pt-4">
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground text-xs">
									{t("campaigns.targeting.totalBudget")}
								</span>
								<strong className="text-base tabular-nums">
									{totalBudget.toLocaleString(undefined, {
										style: "currency",
										currency: "USD",
									})}
								</strong>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground text-xs">
									{t("campaigns.targeting.totalImpressions")}
								</span>
								<strong className="text-base tabular-nums">
									{totalImpressions.toLocaleString()}
								</strong>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="w-full flex justify-between items-end">
				<Button
					variant="secondary"
					onClick={async () =>
						await router.navigate({ to: "/campaigns/$id/identity" })
					}
					className="w-full @sm:w-fit"
				>
					{t("Save and go back")}
				</Button>

				<Button
					onClick={async () =>
						await router.navigate({ to: "/campaigns/$id/creative" })
					}
					className="w-full @sm:w-fit"
				>
					{t("Save and continue")}
				</Button>
			</div>
		</div>
	);
}
