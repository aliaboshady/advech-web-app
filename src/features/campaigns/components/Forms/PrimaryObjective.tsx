import { FormikProps } from "formik";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Objective } from "@/features/Objectives/types";
import { cn } from "@/lib/utils";
import { CampaignDetailsFormValues } from "../../build-campaign-details-payload";
import { FieldMessage } from "./FieldMessage";

type Props = {
	formik: FormikProps<CampaignDetailsFormValues>;
	objectives: Objective[];
	readOnly?: boolean;
};

export function PrimaryObjective({
	formik,
	objectives,
	readOnly = false,
}: Props) {
	const { t } = useTranslation();
	const labelId = useId();
	const error = formik.touched.objectiveCode
		? formik.errors.objectiveCode
		: undefined;
	return (
		<div className="flex flex-col gap-2 @md/formSection:col-span-2">
			<Label id={labelId}>{t("campaigns.identity.objective")}</Label>
			<div
				role="radiogroup"
				aria-labelledby={labelId}
				className="grid gap-3 @md/formSection:grid-cols-2"
			>
				{objectives?.map((option) => {
					const isSelected = formik.values.objectiveCode === option.id;
					return (
						<button
							key={option.id}
							type="button"
							role="radio"
							aria-checked={isSelected}
							disabled={readOnly}
							className={cn(
								"flex flex-col gap-1 rounded-lg border bg-background p-4 text-start outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default",
								isSelected
									? "border-foreground bg-accent"
									: "border-input enabled:hover:bg-accent",
							)}
							onClick={() => {
								formik.setFieldValue("objectiveCode", option.id);
								formik.setFieldTouched("objectiveCode", true, false);
							}}
						>
							<span className="flex items-center gap-2 text-body-md font-medium">
								<span
									aria-hidden="true"
									className={cn(
										"flex size-4 shrink-0 items-center justify-center rounded-full border",
										isSelected
											? "border-foreground"
											: "border-muted-foreground",
									)}
								>
									{isSelected ? (
										<span className="size-2 rounded-full bg-foreground" />
									) : null}
								</span>
								{option.name}
							</span>
							{option.description ? (
								<span className="ps-6 text-body-md text-muted-foreground">
									{option.description}
								</span>
							) : null}
						</button>
					);
				})}
			</div>
			<FieldMessage message={error ?? ""} />
		</div>
	);
}
