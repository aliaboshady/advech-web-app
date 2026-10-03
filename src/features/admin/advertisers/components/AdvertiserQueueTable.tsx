import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import DataTable, { Column } from "@/components/Table/DataTable";
import { formatDate } from "@/lib/utils";
import { PaginatedResponse, SortType } from "@/types";
import { AdvertiserSummary } from "../advertiser-summary";

type AdvertiserQueueTableProps = {
	readonly data?: PaginatedResponse<AdvertiserSummary> | null;
	readonly page?: number;
	readonly setPage?: (page: number) => void;
	readonly limit?: number;
	readonly setLimit?: (limit: number) => void;
	readonly sortBy?: string;
	readonly setSortBy?: (sortBy: string) => void;
	readonly sortType?: SortType;
	readonly setSortType?: (sortType: SortType) => void;
	readonly loading?: boolean;
};

function displayText(value: string | null): string {
	if (value === null || value.trim().length === 0) {
		return "—";
	}
	return value;
}

function displayCreatedAt(createdAt: string): string {
	const formatted = formatDate(createdAt, "date");
	if (formatted.length === 0 || formatted === "Invalid DateTime") {
		return "—";
	}
	return formatted;
}

/** The six columns of the Advertiser review queue. */
export function AdvertiserQueueTable({
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
}: AdvertiserQueueTableProps) {
	const { t } = useTranslation();
	const items = data?.data?.docs ?? [];
	const columns: Column[] = [
		{
			header: () => t("admin.advertisers.columns.companyName"),
			sortKey: "companyName",
			value: (advertiser: AdvertiserSummary) => (
				<Link
					to="/admin/advertisers/$id"
					params={{ id: advertiser.id }}
					className="hover:underline"
				>
					{displayText(advertiser.companyName)}
				</Link>
			),
		},
		{
			header: () => t("admin.advertisers.columns.country"),
			value: (advertiser: AdvertiserSummary) => displayText(advertiser.country),
		},
		{
			header: () => t("admin.advertisers.columns.city"),
			value: (advertiser: AdvertiserSummary) => displayText(advertiser.city),
		},
		{
			header: () => t("admin.advertisers.columns.ownerEmail"),
			value: (advertiser: AdvertiserSummary) =>
				displayText(advertiser.ownerEmail),
		},
		{
			header: () => t("admin.advertisers.columns.status"),
			sortKey: "status",
			value: (advertiser: AdvertiserSummary) => (
				<StatusBadge kind="advertiser" status={advertiser.status} />
			),
		},
		{
			header: () => t("admin.advertisers.columns.createdAt"),
			sortKey: "createdAt",
			value: (advertiser: AdvertiserSummary) =>
				displayCreatedAt(advertiser.createdAt),
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
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortType={sortType}
			setSortType={setSortType}
			loading={loading}
		/>
	);
}
