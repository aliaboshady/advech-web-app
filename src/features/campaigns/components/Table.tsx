import { PencilLineIcon, TrashIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "@/components/Dialogs/ConfirmationDialog";
import DataTable, { Column } from "@/components/Table/DataTable";
import { DropdownAction } from "@/components/Table/DropdownActions";
import { statusLabels } from "@/lib/staticKeys";
import { getStatusColor } from "@/lib/utils";
import { PaginatedResponse, SortType } from "@/types";
import { Campaign } from "../types";

type Props = {
	data?: PaginatedResponse<Campaign>;
	setPage?: (val: number) => void;
	page?: number;
	setLimit?: (val: number) => void;
	limit?: number;
	search?: string;
	dateRange?: DateRange;
	// fetch?: (payload: SessionsPayload) => Promise<PaginatedResponse<Campaign>>;
	sortBy?: string;
	setSortBy?: (val: string) => void;
	sortType?: SortType;
	setSortType?: (val: SortType) => void;
	loading?: boolean;
};

const Table = ({
	data,
	search,
	dateRange,
	page = 1,
	setPage,
	limit = 10,
	setLimit,
	// fetch,
	sortBy,
	setSortBy,
	sortType,
	setSortType,
	loading,
}: Props) => {
	const { t } = useTranslation();
	const items = data;
	const pagination = data ?? {
		data: {
			docs: data,
			page,
			limit,
			totalItems: data?.length,
			totalPages: Math.ceil((data?.length || 0) / limit),
			hasPreviousPage: false,
			hasNextPage: false,
		},
	};

	const columns: Column[] = [
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
					{t(statusLabels[campaign.status] as any) ?? campaign.status}
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

	const dropdownActions: DropdownAction<Campaign>[] = [
		{
			label: t("common.edit"),
			icon: <PencilLineIcon className="text-muted-foreground" />,
			href: "/campaigns/$id/identity",
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
			dataPagination={pagination}
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
