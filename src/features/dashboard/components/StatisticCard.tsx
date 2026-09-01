import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Props = {
	title: string;
	description: string;
	icon: React.ReactNode;
};

export function StatisticCard({ title, description, icon }: Props) {
	return (
		<Card className="gap-2 min-w-40 flex-1 justify-between">
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<CardTitle className="text-base font-light">{title}</CardTitle>
				<CardAction>{icon}</CardAction>
			</CardHeader>

			<CardContent className="text-4xl font-bold text-muted-foreground">
				{description}
			</CardContent>
		</Card>
	);
}
