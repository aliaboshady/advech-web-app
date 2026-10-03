import { PencilLineIcon, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "@/components/Dialogs/ConfirmationDialog";
import DataTable, { Column } from "@/components/Table/DataTable";
import { DropdownAction } from "@/components/Table/DropdownActions";
import { getStatusColor } from "@/lib/utils";
import { PaginatedResponse, SortType } from "@/types";
import { formatMoney } from "../format-money";
import { Campaign } from "../types";

type Props = {
	data?: PaginatedResponse<Campaign> | null;
	setPage?: (val: number) => void;
	page?: number;
	setLimit?: (val: number) => void;
	limit?: number;
	sortBy?: string;
	setSortBy?: (val: string) => void;
	sortType?: SortType;
	setSortType?: (val: SortType) => void;
	loading?: boolean;
};

const Table = ({
	data,
	page = 1,
	setPage,
	limit = 10,
	setLimit,
	sortBy,
	setSortBy,
	sortType,
	setSortType,
	loading,
}: Props) => {
	const { t, i18n } = useTranslation();
	const items = data?.data?.docs ?? [];

	const columns: Column[] = [
		{
			header: () => t("dashboard.table.campaignName"),
			value: (campaign: Campaign) => campaign.name,
			sortKey: "name",
		},
		{
			header: () => t("dashboard.table.status"),
			value: (campaign: Campaign) => (
				<span
					className={`rounded-sm text-white ${getStatusColor(campaign.status)} p-1.5 text-xs text-muted`}
				>
					{t(`campaigns.statuses.${campaign.status}` as any)}
				</span>
			),
		},
		{
			header: () => t("campaigns.table.objective"),
			value: (campaign: Campaign) => campaign.objective.name,
		},
		{
			header: () => t("campaigns.table.flight"),
			value: (campaign: Campaign) =>
				campaign.flight?.startDate && campaign.flight.endDate
					? `${campaign.flight.startDate} → ${campaign.flight.endDate}`
					: "—",
			sortKey: "startDate",
		},
		{
			header: () => t("dashboard.table.budget"),
			value: (campaign: Campaign) =>
				formatMoney(campaign.budget?.total, i18n.language),
		},
	];

	const dropdownActions: DropdownAction<Campaign>[] = [
		{
			label: t("common.edit"),
			icon: <PencilLineIcon className="text-muted-foreground" />,
			href: (campaign?: Campaign) => `/campaigns/${campaign?.id}/identity`,
		},
		{
			label: t("common.delete"),
			icon: <TrashIcon className="text-red-600" />,
			dialog: ConfirmationDialog,
			props: {
				onAction: async () => {},
			},
		},
	];

	return (
		<DataTable
			className="h-[calc(100vh-12rem)]"
			items={items}
			columns={columns}
			dataPagination={data ?? undefined}
			page={page}
			setPage={setPage}
			setItemsPerPage={setLimit}
			itemsPerPage={limit}
			dropdownActions={dropdownActions}
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortType={sortType}
			setSortType={setSortType}
			loading={loading}
		/>
	);
};

export default Table;
