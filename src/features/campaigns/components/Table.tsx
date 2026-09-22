import { PencilLineIcon, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "@/components/Dialogs/ConfirmationDialog";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import DataTable, { Column } from "@/components/Table/DataTable";
import { DropdownAction } from "@/components/Table/DropdownActions";
import useRequest from "@/hooks/useRequest";
import { statusLabels } from "@/lib/staticKeys";
import { getStatusColor } from "@/lib/utils";
import { BackendResponse, SortType } from "@/types";
import { deleteCampaign } from "../api/delete-campaign";
import { Campaign, GetCampaignsPayload } from "../types";

type Props = {
	data?: BackendResponse<Campaign[]>;
	setPage?: (val: number) => void;
	page?: number;
	setLimit?: (val: number) => void;
	limit?: number;
	search?: string;
	dateRange?: DateRange;
	fetch?: (
		payload: GetCampaignsPayload,
	) => Promise<BackendResponse<Campaign[]>>;
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
	const { t } = useTranslation();

	const { request: deleteCampaignReq } = useRequest<
		string,
		BackendResponse<void>
	>(deleteCampaign, {
		showSuccessToast: true,
	});

	const columns: Column[] = [
		{
			header: () => t("dashboard.table.campaignName"),
			value: (campaign: Campaign) => campaign.name,
			sortKey: "name",
		},
		{
			header: () => t("dashboard.table.status"),
			value: (campaign: Campaign) => (
				<StatusBadge kind="campaign" status={campaign.status} />
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
			icon: <TrashIcon className="text-destructive" />,
			dialog: ConfirmationDialog,
			props: {
				onAction: async () => {},
			},
		},
	];

	return (
		<DataTable
			className="rounded-none border-0"
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
