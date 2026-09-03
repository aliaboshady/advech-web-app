import { PencilLineIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import DataTable, { Column } from "@/components/Table/DataTable";
import { DropdownAction } from "@/components/Table/DropdownActions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Props = {
	className?: string;
};

function getStatusColor(status: string) {
	switch (status) {
		case "Active":
			return "bg-emerald-600";
		case "Scheduled":
			return "bg-sky-600";
		case "Paused":
			return "bg-amber-600";
		case "Completed":
			return "bg-slate-600";
		case "Cancelled":
			return "bg-rose-600";
		default:
			return "bg-slate-600";
	}
}

const campaigns = [
	{
		id: "1",
		name: "Ramadan Reach",
		status: "Active",
		budget: 18500,
		impressions: 1240000,
	},
	{
		id: "2",
		name: "Summer Sale",
		status: "Scheduled",
		budget: 12000,
		impressions: 860000,
	},
	{
		id: "3",
		name: "Back to School",
		status: "Paused",
		budget: 9500,
		impressions: 425000,
	},
	{
		id: "4",
		name: "City Nights",
		status: "Cancelled",
		budget: 22400,
		impressions: 1780000,
	},
	{
		id: "5",
		name: "Winter Warmth",
		status: "Completed",
		budget: 15750,
		impressions: 1090000,
	},
	{
		id: "6",
		name: "New Year Kickoff",
		status: "Active",
		budget: 28000,
		impressions: 2150000,
	},
	{
		id: "7",
		name: "Weekend Specials",
		status: "Scheduled",
		budget: 8200,
		impressions: 510000,
	},
	{
		id: "8",
		name: "Summer Nights",
		status: "Active",
		budget: 19600,
		impressions: 1430000,
	},
	{
		id: "9",
		name: "Holiday Countdown",
		status: "Paused",
		budget: 11300,
		impressions: 670000,
	},
	{
		id: "10",
		name: "Black Friday Deals",
		status: "Completed",
		budget: 32500,
		impressions: 2860000,
	},
];

export function Table({ className }: Props) {
	const { t } = useTranslation();
	const [page, setPage] = useState(1);
	const statusLabels: Record<string, string> = {
		Active: t("campaigns.status.active"),
		Scheduled: t("campaigns.status.scheduled"),
		Paused: t("campaigns.status.paused"),
		Completed: t("campaigns.status.completed"),
		Cancelled: t("campaigns.status.cancelled"),
	};
	const campaignColumns: Column[] = [
		{
			header: () => t("dashboard.table.campaignName"),
			value: (campaign) => campaign.name,
			sortKey: "name",
		},
		{
			header: () => t("dashboard.table.status"),
			value: (campaign) => (
				<span
					className={`rounded-sm text-white ${getStatusColor(campaign.status)} p-1.5 text-xs text-muted`}
				>
					{statusLabels[campaign.status] ?? campaign.status}
				</span>
			),
		},
		{
			header: () => t("dashboard.table.budget"),
			value: (campaign) => `$${campaign.budget.toLocaleString()}`,
			sortKey: "budget",
		},
		{
			header: () => t("dashboard.table.impressions"),
			value: (campaign) => campaign.impressions.toLocaleString(),
			sortKey: "impressions",
		},
	];
	const dropdownActions: DropdownAction[] = [
		{
			label: t("common.edit"),
			icon: <PencilLineIcon className="text-muted-foreground" />,
		},
		{
			label: t("common.delete"),
			icon: <TrashIcon className="text-red-600" />,
		},
	];

	return (
		<Card className={twMerge("w-full h-full", className)}>
			<CardHeader>
				<CardTitle>{t("dashboard.table.recentCampaigns")}</CardTitle>
				<CardDescription>{t("dashboard.table.description")}</CardDescription>
			</CardHeader>

			<CardContent className="min-h-0 flex-1 overflow-hidden p-0">
				<DataTable
					items={campaigns}
					columns={campaignColumns}
					className="h-full rounded-none border-x-0 border-b-0 border-t"
					dropdownActions={dropdownActions}
					page={page}
					setPage={setPage}
				/>
			</CardContent>
		</Card>
	);
}
