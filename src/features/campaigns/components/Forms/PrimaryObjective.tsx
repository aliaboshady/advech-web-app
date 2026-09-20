import { FormikProps } from "formik";
import {
	Building2Icon,
	DownloadIcon,
	EyeIcon,
	ShoppingCartIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Objective } from "@/features/Objectives/types";

// const objectiveOptions = [
// 	{
// 		value: "brand-awareness",
// 		label: "Brand Awareness",
// 		description: "Maximize impressions across high-density urban corridors.",
// 		icon: EyeIcon,
// 	},
// 	{
// 		value: "app-installs",
// 		label: "App Installs",
// 		description: "Drive immediate mobile app downloads via QR integration.",
// 		icon: DownloadIcon,
// 	},
// 	{
// 		value: "foot-traffic",
// 		label: "Foot Traffic",
// 		description: "Route audiences to specific physical retail locations.",
// 		icon: Building2Icon,
// 	},
// 	{
// 		value: "conversion",
// 		label: "Conversion",
// 		description: "Optimize for specific or web-based actions.",
// 		icon: ShoppingCartIcon,
// 	},
// ] as const;

type Props = {
	formik: FormikProps<any>;
	objectives: Objective[];
};

export function PrimaryObjective({ formik, objectives }: Props) {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm font-medium">Primary Objective</p>

			<div className="flex flex-col @xl:flex-row gap-3">
				{objectives?.map((option) => {
					const isSelected = formik.values.objectiveCode === option.id;

					return (
						<Card
							key={option.id}
							className={`@xl:w-150 rounded-lg transition-colors p-6 cursor-pointer ${
								isSelected
									? "border-primary bg-primary/5 ring-2 ring-primary"
									: "hover:border-primary/50"
							}`}
							onClick={() => formik.setFieldValue("objectiveCode", option.id)}
						>
							<CardContent className="gap-1 p-0">
								<div className="flex items-center gap-2 font-medium">
									<div className="bg-primary h-5 w-5 rounded-full shrink-0" />
									<span>{option.name}</span>
								</div>
								<p className="pl-6.5 text-sm text-muted-foreground">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
