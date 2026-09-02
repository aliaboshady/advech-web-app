import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
	const chartData = [
		{ month: "January", desktop: 186 },
		{ month: "February", desktop: 305 },
		{ month: "March", desktop: 237 },
		{ month: "April", desktop: 73 },
		{ month: "May", desktop: 209 },
		{ month: "June", desktop: 214 },
	];
	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;

	return (
		<Card className={twMerge("w-full h-full", className)}>
			<CardHeader>
				<CardTitle>Impressions</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
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
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
