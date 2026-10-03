import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { useGetPaginated } from "@/hooks/useGetPaginated";
import Filter from "../components/Filter";
import Table from "../components/Table";
import { Campaign, CampaignFilterStatus } from "../types";

const campaigns: Campaign[] = [
	{
		id: "1",
		name: "Ramadan Reach",
		status: "Active",
		budget: 18500,
		impressions: 1240000,
		fromDate: "2026-02-18T00:00:00.000Z",
		toDate: "2026-03-20T23:59:59.000Z",
	},
	{
		id: "2",
		name: "Summer Sale",
		status: "Scheduled",
		budget: 12000,
		impressions: 860000,
		fromDate: "2026-06-01T00:00:00.000Z",
		toDate: "2026-06-30T23:59:59.000Z",
	},
	{
		id: "3",
		name: "Back to School",
		status: "Paused",
		budget: 9500,
		impressions: 425000,
		fromDate: "2026-08-01T00:00:00.000Z",
		toDate: "2026-08-31T23:59:59.000Z",
	},
	{
		id: "4",
		name: "City Nights",
		status: "Cancelled",
		budget: 22400,
		impressions: 1780000,
		fromDate: "2026-04-10T00:00:00.000Z",
		toDate: "2026-05-10T23:59:59.000Z",
	},
	{
		id: "5",
		name: "Winter Warmth",
		status: "Completed",
		budget: 15750,
		impressions: 1090000,
		fromDate: "2026-01-05T00:00:00.000Z",
		toDate: "2026-01-31T23:59:59.000Z",
	},
	{
		id: "6",
		name: "New Year Kickoff",
		status: "Active",
		budget: 28000,
		impressions: 2150000,
		fromDate: "2026-01-01T00:00:00.000Z",
		toDate: "2026-01-15T23:59:59.000Z",
	},
	{
		id: "7",
		name: "Weekend Specials",
		status: "Scheduled",
		budget: 8200,
		impressions: 510000,
		fromDate: "2026-09-05T00:00:00.000Z",
		toDate: "2026-09-27T23:59:59.000Z",
	},
	{
		id: "8",
		name: "Summer Nights",
		status: "Active",
		budget: 19600,
		impressions: 1430000,
		fromDate: "2026-07-01T00:00:00.000Z",
		toDate: "2026-07-31T23:59:59.000Z",
	},
	{
		id: "9",
		name: "Holiday Countdown",
		status: "Paused",
		budget: 11300,
		impressions: 670000,
		fromDate: "2026-11-15T00:00:00.000Z",
		toDate: "2026-12-24T23:59:59.000Z",
	},
	{
		id: "10",
		name: "Black Friday Deals",
		status: "Completed",
		budget: 32500,
		impressions: 2860000,
		fromDate: "2025-11-21T00:00:00.000Z",
		toDate: "2025-11-30T23:59:59.000Z",
	},
];

export function CampaignsPage() {
	const { t } = useTranslation();
	const [dateRange, setDateRange] = useState<DateRange>();
	const [status, setStatus] = useState<CampaignFilterStatus | undefined>();

	const {
		fetch,
		refetch,
		data,
		isLoading,
		page,
		setPage,
		limit,
		setLimit,
		search,
		setSearch,
		sortBy,
		setSortBy,
		sortType,
		setSortType,
		debouncedSearch,
	} = useGetPaginated<void, Campaign>({
		request: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return {
				data: {
					docs: [],
					totalDocs: 0,
					limit: 10,
					totalPages: 0,
					page: 1,
					pagingCounter: 1,
					hasPrevPage: false,
					hasNextPage: false,
					prevPage: null,
					nextPage: null,
				},
			};
		},
		dependencies: [dateRange],
		getExtraPayload: () => ({
			dateFrom: dateRange?.from,
			dateTo: dateRange?.to,
		}),
	});

	return (
		<PageLayout title={t("sidebar.campaigns")} className="flex flex-col gap-4">
			<Filter
				search={search}
				setSearch={setSearch}
				date={dateRange}
				setDate={setDateRange}
				status={status}
				setStatus={setStatus}
			/>
			<Table
				data={campaigns.length > 0 ? campaigns : undefined}
				fetch={fetch}
				page={page}
				setPage={setPage}
				limit={limit}
				setLimit={setLimit}
				search={debouncedSearch}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortType={sortType}
				setSortType={setSortType}
				loading={isLoading}
				dateRange={dateRange}
			/>
		</PageLayout>
	);
}
