import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { twMerge } from "tailwind-merge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import i18n from "@/i18n";

type Props = {
	className?: string;
};

export function Chart({ className }: Props) {
	const { t } = useTranslation();
	const chartData = [
		{ month: "January", desktop: 186 },
		{ month: "February", desktop: 305 },
		{ month: "March", desktop: 237 },
		{ month: "April", desktop: 73 },
		{ month: "May", desktop: 209 },
		{ month: "June", desktop: 214 },
		{ month: "July", desktop: 0 },
		{ month: "August", desktop: 0 },
		{ month: "September", desktop: 0 },
		{ month: "October", desktop: 0 },
		{ month: "November", desktop: 0 },
		{ month: "December", desktop: 0 },
	];
	const chartConfig = {
		desktop: {
			label: t("dashboard.chart.desktop"),
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;

	return (
		<Card className={twMerge("w-full h-full", className)}>
			<CardHeader>
				<CardTitle>{t("dashboard.chart.impressions")}</CardTitle>
				<CardDescription>{t("dashboard.chart.period")}</CardDescription>
			</CardHeader>

			<Separator />

			<CardContent className="flex-1 min-h-0">
				<ChartContainer
					className="h-full w-full"
					config={chartConfig}
					dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}
				>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid
							vertical={false}
							direction={i18n.dir() === "rtl" ? "rtl" : "ltr"}
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
							reversed={i18n.dir() === "rtl"}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							domain={[0, "auto"]}
							tickCount={5}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="desktop"
							fill="var(--color-desktop)"
							barSize={20}
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
