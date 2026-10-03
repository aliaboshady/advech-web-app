import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { useGetPaginated } from "@/hooks/useGetPaginated";
import { listCampaigns } from "../api/list-campaigns";
import Filter from "../components/Filter";
import Table from "../components/Table";
import { Campaign, CampaignStatus, ListCampaignsPayload } from "../types";

const toCalendarDay = (date: Date) => format(date, "yyyy-MM-dd");

export function CampaignsPage() {
	const { t } = useTranslation();
	const [dateRange, setDateRange] = useState<DateRange>();
	const [statuses, setStatuses] = useState<CampaignStatus[]>([]);

	const {
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
	} = useGetPaginated<ListCampaignsPayload, Campaign>({
		request: listCampaigns,
		dependencies: [dateRange?.from, dateRange?.to, statuses],
		getExtraPayload: () => ({
			status: statuses,
			flightFrom: dateRange?.from && toCalendarDay(dateRange.from),
			flightTo: dateRange?.to && toCalendarDay(dateRange.to),
		}),
	});

	// A filter change can leave the current page past the end of the results.
	const changeDateRange = (range: DateRange) => {
		setPage(1);
		setDateRange(range);
	};
	const changeStatuses = (next: CampaignStatus[]) => {
		setPage(1);
		setStatuses(next);
	};

	return (
		<PageLayout title={t("sidebar.campaigns")} className="flex flex-col gap-4">
			<Filter
				search={search}
				setSearch={setSearch}
				date={dateRange}
				setDate={changeDateRange}
				statuses={statuses}
				setStatuses={changeStatuses}
			/>
			<Table
				data={data}
				page={page}
				setPage={setPage}
				limit={limit}
				setLimit={setLimit}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortType={sortType}
				setSortType={setSortType}
				loading={isLoading}
			/>
		</PageLayout>
	);
}
