import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import useRequest from "@/hooks/useRequest";
import { BackendResponse, ErrorResponse, SortType } from "@/types";
import {
	AdvertiserQueueStatusFilter,
	AdvertiserSummary,
	DEFAULT_ADVERTISER_QUEUE_STATUS,
} from "./advertiser-summary";
import { listAdvertisers } from "./api/list-advertisers";
import { pageAdvertiserQueue } from "./page-advertiser-queue";

const DEFAULT_LIMIT = 10;
const SEARCH_DELAY_MS = 500;
const DEFAULT_SORT_BY = "createdAt";

/**
 * Advertiser review queue.
 * Same controls as the server-paged list hook; paging happens in the browser.
 */
export function useAdvertiserQueue() {
	const [status, setStatusValue] = useState<AdvertiserQueueStatusFilter>(
		DEFAULT_ADVERTISER_QUEUE_STATUS,
	);
	const [page, setPage] = useState(1);
	const [limit, setLimitValue] = useState(DEFAULT_LIMIT);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
	const [sortType, setSortType] = useState<SortType>("desc");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [advertisers, setAdvertisers] = useState<AdvertiserSummary[] | null>(
		null,
	);
	const {
		request: fetchList,
		isLoading,
		error,
	} = useRequest<
		AdvertiserQueueStatusFilter,
		BackendResponse<AdvertiserSummary[]>
	>(listAdvertisers);
	const refetch = async (): Promise<void> => {
		const result = await fetchList(status);
		setAdvertisers(result.data ?? []);
	};
	const setLimit = (nextLimit: number): void => {
		setLimitValue(nextLimit);
		setPage(1);
	};
	const setStatus = (nextStatus: AdvertiserQueueStatusFilter): void => {
		setStatusValue(nextStatus);
		setPage(1);
	};
	// The list is refetched only when the status filter changes. Search and sort stay local.
	useEffect(() => {
		let isCurrent = true;
		setAdvertisers(null);
		fetchList(status)
			.then((result) => {
				if (isCurrent) {
					setAdvertisers(result.data ?? []);
				}
			})
			.catch(() => {
				if (isCurrent) {
					setAdvertisers(null);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [status]);
	useDebounce(
		() => {
			if (search !== debouncedSearch) {
				setPage(1);
			}
			setDebouncedSearch(search);
		},
		SEARCH_DELAY_MS,
		[search],
	);
	const data: BackendResponse<AdvertiserSummary[]> | undefined =
		advertisers === null
			? undefined
			: {
					success: true,
					...pageAdvertiserQueue(advertisers, {
						page,
						limit,
						search: debouncedSearch,
						orderBy: sortBy,
						orderType: sortType,
					}),
				};
	const isQueueLoading =
		isLoading || (advertisers === null && error === undefined);
	return {
		fetch: fetchList,
		refetch,
		data,
		isLoading: isQueueLoading,
		error,
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
		status,
		setStatus,
	};
}

export type AdvertiserQueueError = Error | ErrorResponse | undefined;
