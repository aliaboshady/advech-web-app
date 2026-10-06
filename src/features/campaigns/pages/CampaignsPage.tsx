import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { TableCard, TableCardToolbar } from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { useGetPaginated } from "@/hooks/useGetPaginated";
import { listCampaigns } from "../api/list-campaigns";
import Filter from "../components/Filter";
import Table from "../components/Table";
import { Campaign, CampaignStatus, ListCampaignsPayload } from "../types";

const toCalendarDay = (date: Date) => format(date, "yyyy-MM-dd");

export function CampaignsPage() {
	const { t } = useTranslation();
	const router = useRouter();
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
	} = useGetPaginated<ListCampaignsPayload, Campaign[]>({
		request: listCampaigns,
		dependencies: [dateRange?.from, dateRange?.to, statuses],
		requestExtraPayload: () => ({
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
		<PageLayout
			title={t("sidebar.campaigns")}
			description={t("campaigns.list.description")}
			actions={
				<Button
					onClick={async () => await router.navigate({ to: "/campaigns/new" })}
				>
					<PlusIcon />
					{t("campaigns.list.create")}
				</Button>
			}
		>
			<TableCard>
				<TableCardToolbar>
					<Filter
						search={search}
						setSearch={setSearch}
						date={dateRange}
						setDate={changeDateRange}
						statuses={statuses}
						setStatuses={changeStatuses}
					/>
				</TableCardToolbar>
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
			</TableCard>
		</PageLayout>
	);
}
