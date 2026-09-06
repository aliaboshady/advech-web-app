import { FormikProps } from "formik";
import {
	Building2Icon,
	DownloadIcon,
	EyeIcon,
	ShoppingCartIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const objectiveOptions = [
	{
		value: "brand-awareness",
		label: "Brand Awareness",
		description: "Maximize impressions across high-density urban corridors.",
		icon: EyeIcon,
	},
	{
		value: "app-installs",
		label: "App Installs",
		description: "Drive immediate mobile app downloads via QR integration.",
		icon: DownloadIcon,
	},
	{
		value: "foot-traffic",
		label: "Foot Traffic",
		description: "Route audiences to specific physical retail locations.",
		icon: Building2Icon,
	},
	{
		value: "conversion",
		label: "Conversion",
		description: "Optimize for specific or web-based actions.",
		icon: ShoppingCartIcon,
	},
] as const;

type Props = {
	formik: FormikProps<any>;
};

export function PrimaryObjective({ formik }: Props) {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm font-medium">Primary Objective</p>

			<div className="flex flex-col @xl:flex-row gap-3">
				{objectiveOptions.map((option) => {
					const Icon = option.icon;
					const isSelected = formik.values.primaryObjective === option.value;

					return (
						<Card
							key={option.value}
							className={`@xl:w-150 rounded-lg transition-colors p-6 ${
								isSelected
									? "border-primary bg-primary/5 ring-2 ring-primary"
									: "hover:border-primary/50"
							}`}
							onClick={() =>
								formik.setFieldValue("primaryObjective", option.value)
							}
						>
							<CardContent className="gap-1 p-0">
								<div className="flex items-center gap-2 font-medium">
									<Icon size={18} aria-hidden="true" />
									<span>{option.label}</span>
								</div>
								<p className="pl-6.5 text-sm text-muted-foreground">
									{option.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
