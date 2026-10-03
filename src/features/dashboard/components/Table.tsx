import { PencilLineIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import DataTable, { Column } from "@/components/Table/DataTable";
import { DropdownAction } from "@/components/Table/DropdownActions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CampaignStatus } from "@/features/campaigns/types";

type Props = {
	className?: string;
};

const campaigns = [
	{
		id: "1",
		name: "Ramadan Reach",
		status: "LIVE" as CampaignStatus,
		budget: 18500,
		impressions: 1240000,
	},
	{
		id: "2",
		name: "Summer Sale",
		status: "SCHEDULED" as CampaignStatus,
		budget: 12000,
		impressions: 860000,
	},
	{
		id: "3",
		name: "Back to School",
		status: "PAUSED" as CampaignStatus,
		budget: 9500,
		impressions: 425000,
	},
	{
		id: "4",
		name: "City Nights",
		status: "ARCHIVED" as CampaignStatus,
		budget: 22400,
		impressions: 1780000,
	},
	{
		id: "5",
		name: "Winter Warmth",
		status: "COMPLETED" as CampaignStatus,
		budget: 15750,
		impressions: 1090000,
	},
	{
		id: "6",
		name: "New Year Kickoff",
		status: "LIVE" as CampaignStatus,
		budget: 28000,
		impressions: 2150000,
	},
	{
		id: "7",
		name: "Weekend Specials",
		status: "SCHEDULED" as CampaignStatus,
		budget: 8200,
		impressions: 510000,
	},
	{
		id: "8",
		name: "Summer Nights",
		status: "LIVE" as CampaignStatus,
		budget: 19600,
		impressions: 1430000,
	},
	{
		id: "9",
		name: "Holiday Countdown",
		status: "PAUSED" as CampaignStatus,
		budget: 11300,
		impressions: 670000,
	},
	{
		id: "10",
		name: "Black Friday Deals",
		status: "COMPLETED" as CampaignStatus,
		budget: 32500,
		impressions: 2860000,
	},
];

export function Table({ className }: Props) {
	const { t } = useTranslation();
	const [page, setPage] = useState(1);

	const campaignColumns: Column[] = [
		{
			header: () => t("dashboard.table.campaignName"),
			value: (campaign) => campaign.name,
			sortKey: "name",
		},
		{
			header: () => t("dashboard.table.status"),
			value: (campaign) => (
				<StatusBadge kind="campaign" status={campaign.status} />
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
			icon: <TrashIcon className="text-destructive" />,
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
