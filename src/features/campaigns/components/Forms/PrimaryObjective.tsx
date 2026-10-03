import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Objective } from "@/features/Objectives/types";
import { CampaignDetailsFormValues } from "../../build-campaign-details-payload";

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
	const error = formik.touched.objectiveCode
		? formik.errors.objectiveCode
		: undefined;
	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm font-medium">{t("campaigns.identity.objective")}</p>
			<div className="flex flex-col @xl:flex-row gap-3">
				{objectives?.map((option) => {
					const isSelected = formik.values.objectiveCode === option.id;
					return (
						<Card
							key={option.id}
							aria-disabled={readOnly}
							className={`@xl:w-150 rounded-lg transition-colors p-6 ${
								readOnly ? "cursor-default" : "cursor-pointer"
							} ${
								isSelected
									? "border-primary bg-primary/5 ring-2 ring-primary"
									: "hover:border-primary/50"
							}`}
							onClick={() => {
								if (readOnly) {
									return;
								}
								formik.setFieldValue("objectiveCode", option.id);
								formik.setFieldTouched("objectiveCode", true, false);
							}}
						>
							<CardContent className="gap-1 p-0">
								<div className="flex items-center gap-2 font-medium">
									<div className="bg-primary h-5 w-5 rounded-full shrink-0" />
									<span>{option.name}</span>
								</div>
								{option.description ? (
									<p className="pl-6.5 text-sm text-muted-foreground">
										{option.description}
									</p>
								) : null}
							</CardContent>
						</Card>
					);
				})}
			</div>
			{error ? (
				<p className="text-xs text-destructive font-medium">
					{t(`errors.${error}`, { defaultValue: error })}
				</p>
			) : null}
		</div>
	);
}
